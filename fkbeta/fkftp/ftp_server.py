import os
from twisted.python import filepath
from twisted.protocols import ftp
from twisted.cred import portal
from twisted.python import log
from twisted.internet import defer, reactor, interfaces
from zope.interface import Interface, implements
import djangoauth
import file_watching

"""
This is pretty spagetti, but this is the price of overloading the complexity 
of the Twisted FTP implementation and the general inflexibility of the aging protocol.

This is basically the normal twisted FTP server, but it adds support for encoded filenames, append/restore,
django authentication, and messages events via zmq to a broker. 

"""

class SaferDTP(ftp.DTP):
    "DTP with text encoding"
    def sendLine(self, line):
        ftp.DTP.sendLine(self, line.encode(self.pi.encoding))

    def connectionMade(self):
        self._buffer = []
        self.isConnected = True
        self.factory.deferred.callback(None)

class SaferDTPFactory(ftp.DTPFactory):
    def buildProtocol(self, addr):
        #log.msg('DTPFactory.buildProtocol', debug=True)
        if self._state is not self._IN_PROGRESS:
            return None
        self._state = self._FINISHED

        self.cancelTimeout()
        p = SaferDTP()
        p.factory = self
        p.pi = self.pi
        self.pi.dtpInstance = p
        return p

class UploadFTPProtocol(ftp.FTP):
    encoding = "latin-1"
    # debug tracking below
    def lineReceived(self, line):
        if self.shell:
            log.msg("%s <- %r" % (self.shell.avatarId, line.decode(self.encoding)))
        ftp.FTP.lineReceived(self, line)

    def sendLine(self, line):
        if self.shell:
            log.msg("%s -> %r" % (self.shell.avatarId, line.encode(self.encoding)))
        ftp.FTP.sendLine(self, line)

    def ftp_PASV(self):
        log.msg("PASV - %r %r" % (self.dtpFactory, self.dtpPort))
        # cleanupDTP sets dtpFactory to none.  Later we'll do
        # cleanup here or something.
        self.cleanupDTP()

        self.dtpFactory = SaferDTPFactory(pi=self)
        self.dtpFactory.setTimeout(self.dtpTimeout)
        self.dtpPort = self.getDTPPort(self.dtpFactory)

        host = self.transport.getHost().host
        port = self.dtpPort.getHost().port
        self.reply(ftp.ENTERING_PASV_MODE, (ftp.encodeHostPort(host, port)))

    def ftp_PORT(self, address):
        addr = map(int, address.split(','))
        ip = '%d.%d.%d.%d' % tuple(addr[:4])
        port = addr[4] << 8 | addr[5]

        # if we have a DTP port set up, lose it.
        log.msg("PASV - %r %r" % (self.dtpFactory, self.dtpPort))
        #if (self.dtpFactory is None) and self.dtpPort: log.msg("%s - PORT - dtpFactory true but dtpPort false. Possible bug")
        #if self.dtpFactory is not None:
        self.cleanupDTP()

        self.dtpFactory = SaferDTPFactory(pi=self, peerHost=self.transport.getPeer().host)
        self.dtpFactory.setTimeout(self.dtpTimeout)
        self.dtpPort = reactor.connectTCP(ip, port, self.dtpFactory)

        def connected(ignored):
            return ftp.ENTERING_PORT_MODE
        def connFailed(err):
            err.trap(ftp.PortConnectionError)
            return ftp.CANT_OPEN_DATA_CNX
        return self.dtpFactory.deferred.addCallbacks(connected, connFailed)

    def ftp_LIST(self, path=''):
        if self.dtpInstance is None or not self.dtpInstance.isConnected:
            return self.dtpFactory.deferred.addCallback(lambda x : ftp.FTP.ftp_LIST(self, path))
        else:
            return ftp.FTP.ftp_LIST(self, path)

    def ftp_RETR(self, path=''):
        if self.dtpInstance is None or not self.dtpInstance.isConnected:
            return self.dtpFactory.deferred.addCallback(lambda x : ftp.FTP.ftp_RETR(self, path))
        else:
            return ftp.FTP.ftp_RETR(self, path)

    def ftp_STOR(self, path=''):
        if self.dtpInstance is None or not self.dtpInstance.isConnected:
            return self.dtpFactory.deferred.addCallback(lambda x : ftp.FTP.ftp_STOR(self, path))
        else:
            return ftp.FTP.ftp_STOR(self, path)

    def ftp_REST(self, pos):
        self.shell.pos = int(pos)
        self.sendLine('350 Rest supported. Restarting at %i' % self.shell.pos)

    def ftp_APPE(self, path):
        self.shell.append = True
        return self.ftp_STOR(path)

    def cleanupDTP(self):
        """
        Call when DTP connection exits
        """
        #log.msg('Cleaning up connections', debug=True)
        dtpPort, self.dtpPort = self.dtpPort, None
        if dtpPort is None:
            pass
        elif interfaces.IListeningPort.providedBy(dtpPort):
            #log.msg("Try to stop listening", debug=True)
            dtpPort.stopListening()
        elif interfaces.IConnector.providedBy(dtpPort):
            #log.msg("Try to disconnect", debug=True)
            dtpPort.disconnect()
        else:
            assert False, "dtpPort should be an IListeningPort or IConnector, instead is %r" % (dtpPort,)
        if self.dtpFactory:
            self.dtpFactory.stopFactory()
            self.dtpFactory = None

        if self.dtpInstance is not None:
            self.dtpInstance = None


class UploadFTPFactory(ftp.FTPFactory):
    allowAnonymous = False
    welcomeMessage = """Welcome to Frikanalen FTP - Velkommen til Frikanalen FTP"""
    protocol = UploadFTPProtocol
    passivePortRange = range(62000, 62000+1000)
    zmq_reporter = None

class UploadFTPShell(ftp.FTPShell):
    """An extended FTPShell that supports REST/APPE, and wraps the file reader/writer"""
    pos = 0
    append = False
    FileWrapper = None
    zmq_reporter = None

    def __init__(self, root, zmq_reporter):
        super(self.__class__, self).__init__(root)
        self.root = root
        self.zmq_reporter = zmq_reporter

    def removeFile(self, path):
        d = super(self.__class__, self).removeFile(path)
        p = self._path(path)
        report = {"filename": self.zmq_reporter.relative_filename(p), "action": "delete", "username": self.avatarId.username}
        self.zmq_reporter.send_message("file.delete", report)
        return d

    def rename(self, fromPath, toPath):
        d = super(self.__class__, self).rename(fromPath, toPath)
        fp = self._path(fromPath)
        tp = self._path(toPath)
        report = {"from_filename":  self.zmq_reporter.relative_filename(fp), "to_filename": self.zmq_reporter.relative_filename(tp), "action": "rename", "username": self.avatarId.username}
        self.zmq_reporter.send_message("file.rename", report)
        return d

    def openForReading(self, path):
        '''
        Extended to support ftp_REST
        '''
        p = self._path(path)
        if p.isdir():
            # Normally, we would only check for EISDIR in open, but win32
            # returns EACCES in this case, so we check before
            return defer.fail(ftp.IsADirectoryError(path))
        try:
            f = p.open('rb')
            if self.pos != 0:
                f.seek(self.pos, 0)
                self.pos = 0
        except (IOError, OSError) as e:
            return ftp.errnoToFailure(e.errno, path)
        except Exception as e:
            return defer.fail(e)
        f = self.FileWrapper(f, file_watching.TransferTypeDownload, filepath=p)
        f.zmq_reporter = self.zmq_reporter
        f.avatarId = self.avatarId
        return defer.succeed(ftp._FileReader(f))

    def openForWriting(self, path):
        '''
        Extended to support ftp_APPE
        '''
        p = self._path(path)
        do_hashing = True
        if p.isdir():
            # Normally, we would only check for EISDIR in open, but win32
            # returns EACCES in this case, so we check before
            return defer.fail(ftp.IsADirectoryError(path))
        try:
            if self.append:
                f = p.open('ab')
                self.append = False
                do_hashing = False
            else:
                f = p.open('wb')
        except (IOError, OSError) as e:
            return ftp.errnoToFailure(e.errno, path)
        except Exception as e:
            return defer.fail(e)
        f = self.FileWrapper(f, file_watching.TransferTypeUpload, do_hashing=do_hashing, filepath=p)
        f.zmq_reporter = self.zmq_reporter
        f.avatarId = self.avatarId
        return defer.succeed(ftp._FileWriter(f))

class UploadFTPRealm:
    implements(portal.IRealm)

    FileWrapper = file_watching.WatchingFileWrapper
    def __init__(self, root, zmq_reporter=None):
        self.root = root
        self.zmq_reporter = zmq_reporter

    def getHomeDirectory(self, avatarId):
        if avatarId.is_superuser:
            path = filepath.FilePath(self.root)
            log.msg("Logged in: %s" % avatarId)
        else:
            path = filepath.FilePath(self.root).child(avatarId.username)
            if not path.isdir():
                path.createDirectory()
                log.msg("Created directory: %s" % path)
        return path

    def requestAvatar(self, avatarId, mind, *interfaces):
        for iface in interfaces:
            if iface is ftp.IFTPShell:
                avatar = UploadFTPShell(self.getHomeDirectory(avatarId), self.zmq_reporter)
                avatar.avatarId = avatarId # To allow the connection to be more aware of the logged in user
                avatar.FileWrapper = self.FileWrapper
                return (ftp.IFTPShell, avatar,
                        getattr(avatar, 'logout', lambda: None))
        raise NotImplementedError("Only IFTPShell interface is supported by this realm")

def start_ftp(port, root, zmq_reporter=None):
    root = os.path.expanduser(root)
    from twisted.internet import reactor
    checker = djangoauth.DjangoAuthChecker()
    realm = UploadFTPRealm(root, zmq_reporter)
    if zmq_reporter:
        realm.FileWrapper = file_watching.ReportingFileWrapper
        realm.zmq_reporter = zmq_reporter
    log.msg("FTP server serving from", root)
    fkportal = portal.Portal(realm, [checker])
    ftpfactory = UploadFTPFactory(portal=fkportal)
    reactor.listenTCP(port, ftpfactory)
