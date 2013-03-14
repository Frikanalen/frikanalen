# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from twisted.python import filepath
from twisted.protocols import ftp
from twisted.cred import portal
from twisted.python import log
from twisted.internet import defer, reactor
import djangoauth

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
        log.msg('DTPFactory.buildProtocol', debug=True)

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
        if self.dtpFactory is not None:
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
        if self.dtpFactory is not None:
            self.cleanupDTP()

        self.dtpFactory = SaferDTPFactory(pi=self, peerHost=self.transport.getPeer().host)
        self.dtpFactory.setTimeout(self.dtpTimeout)
        self.dtpPort = reactor.connectTCP(ip, port, self.dtpFactory)

        def connected(ignored):
            return ENTERING_PORT_MODE
        def connFailed(err):
            err.trap(PortConnectionError)
            return CANT_OPEN_DATA_CNX
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


class UploadFTPFactory(ftp.FTPFactory):
    allowAnonymous = False
    welcomeMessage = """Welcome to Frikanalen FTP - Velkommen til Frikanalen FTP"""
    protocol = UploadFTPProtocol
    passivePortRange = range(5024, 5024+10)
    
class UploadFTPShell(ftp.FTPShell):
    pos = 0
    append = False
    def openForReading(self, path):
        '''
        Overwrite openForReading of ftp.FTPAnonymousShell,
        make it support ftp_REST
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
        except (IOError, OSError), e:
            return ftp.errnoToFailure(e.errno, path)
        except:
            return defer.fail()
        else:
            return defer.succeed(ftp._FileReader(f))

    def openForWriting(self, path):
        '''
        Overwrite openForReading of ftp.FTPShell,
        make it support ftp_APPE
        '''
        p = self._path(path)
        if p.isdir():
            # Normally, we would only check for EISDIR in open, but win32
            # returns EACCES in this case, so we check before
            return defer.fail(ftp.IsADirectoryError(path))
        try:
            if self.append:
                fObj = p.open('ab')
                self.append = False
            else:
                fObj = p.open('wb')
        except (IOError, OSError), e:
            return ftp.errnoToFailure(e.errno, path)
        except:
            return defer.fail()
        return defer.succeed(ftp._FileWriter(fObj))    

class UploadFTPRealm(ftp.BaseFTPRealm):
    root = None
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
                avatar = UploadFTPShell(self.getHomeDirectory(avatarId))
                avatar.avatarId = avatarId # To allow the connection to be more aware of the logged in user
                return (ftp.IFTPShell, avatar,
                        getattr(avatar, 'logout', lambda: None))
        raise NotImplementedError(
            "Only IFTPShell interface is supported by this realm")


def start_ftp(port, root):
    from twisted.internet import reactor
    checker = djangoauth.DjangoAuthChecker()
    realm = UploadFTPRealm("")
    realm.root = root
    fkportal = portal.Portal(realm, [checker])

    ftpfactory = UploadFTPFactory(portal=fkportal)
    reactor.listenTCP(port, ftpfactory)
