if __name__ == '__main__':
    import os
    os.environ["DJANGO_SETTINGS_MODULE"] = "settings"

from twisted.cred import portal
from twisted.python import components, log
from twisted.internet.error import ProcessExitedAlready
from zope import interface
from twisted.conch.ssh import session, filetransfer
from twisted.conch.ssh.filetransfer import FXF_READ, FXF_WRITE, FXF_APPEND, FXF_CREAT, FXF_TRUNC, FXF_EXCL
from twisted.conch.ls import lsLine

from twisted.conch.avatar import ConchUser
from twisted.conch.error import ConchError
from twisted.conch.interfaces import ISession, ISFTPServer, ISFTPFile
from twisted.python import filepath

import file_watching


def toSegments(path):
    """
    Normalize a path, as represented by a list of strings each
    representing one segment of the path.
    """
    segs = []
    for s in path.split('/'):
        print "toSegments", s
        if s == '.' or s == '':
            continue
        elif s == '..':
            if segs:
                segs.pop()
        elif '\0' in s or '/' in s:
            continue
        else:
            segs.append(s)
    return segs


def permissions_to_int(permissions):
    """Convert twisted.python.filepath.Permissions to an integer
    Only handles rwx.
    """
    f = lambda p: (p.read and 4) | (p.write and 2) | (p.execute and 1)
    result = 0
    result |= f(permissions.user) << 6
    result |= f(permissions.group) << 3
    result |= f(permissions.other)
    return result


class FKUploadConchUser(ConchUser):

    def __init__(self, user):
        ConchUser.__init__(self)
        self.user = user
        self.subsystemLookup.update(
                {"sftp": filetransfer.FileTransferServer})
        self.channelLookup.update(
                {"session": session.SSHSession}
                )

    def logout(self):
        log.msg('avatar %s logging out' % self.user)

    def getHomeDirectory(self):
        print "getHome"
        if self.user.is_superuser:
            path = filepath.FilePath(self.root)
            path.sep = '/'
        else:
            path = filepath.FilePath(self.root).child(self.user.username)
            path.sep = '/'
            if not path.isdir():
                path.createDirectory()
        return path

class UploadSFTPRealm:
    interface.implements(portal.IRealm)

    def requestAvatar(self, username, mind, *interfaces):
        print "Logged in", username, interfaces
        user = FKUploadConchUser(username)
        user.root = self.root
        #return FKUploadConchUser, user, user.logout
        return interfaces[0], user, user.logout

class SFTPServerForFKUploadConchUser:

    interface.implements(ISFTPServer)

    def __init__(self, avatar):
        self.avatar = avatar
        print avatar

    def _getAttrs(self, path):
        return {
            "size" : path.getsize(),
            "uid" : path.getUserID(),
            "gid" : path.getGroupID(),
            "permissions" : permissions_to_int(path.getPermissions()),
            "atime" : int(path.getAccessTime()),
            "mtime" : int(path.getModificationTime())
        }

    def _absPath(self, path):
        segments = toSegments(path)
        home = self.avatar.getHomeDirectory()
        res = home
        for segment in segments:
            res = res.child(segment)
        print "_absPath", res
        return res

    def gotVersion(self, otherVersion, extData):
        return {}

    def openFile(self, filename, flags, attrs):
        print "openFile", filename, flags
        return SFTPFile(self, self._absPath(filename).path, flags, attrs)

    def removeFile(self, filename):
        filepath = self._absPath(filename)
        return filepath.remove()

    def renameFile(self, oldpath, newpath):
        oldfilepath = self._absPath(oldpath)
        newfilepath = self._absPath(newpath)
        return oldfilepath.moveTo(newfilepath)

    def makeDirectory(self, path, attrs):
        path = self._absPath(path)
        return path.createDirectory()

    def removeDirectory(self, path):
        path = self._absPath(path)
        return path.remove()

    def openDirectory(self, path):
        print "open dir"
        return SFTPDirectory(self, self._absPath(path))

    def getAttrs(self, path, followLinks):
        print "getattrs en"
        path = self._absPath(path)
        print "pathen path", path
        res = self._getAttrs(path)
        print repr(res)
        return res

    def setAttrs(self, path, attrs):
        #path = self._absPath(path)
        #self.avatar._runAsUser(self._setAttrs, path, attrs)
        raise NotImplementedError

    def readLink(self, path):
        raise NotImplementedError

    def makeLink(self, linkPath, targetPath):
        raise NotImplementedError

    def realPath(self, path):
        print "realPath", path
        if path == ".":
            path = "/"
        if path == "/.":
            path = "/"
        if path == "/..":
            path = "/"
        return path

    def extendedRequest(self, extName, extData):
        raise NotImplementedError

class SFTPFile:

    interface.implements(ISFTPFile)

    def __init__(self, server, filename, flags, attrs):
        self.server = server
        openFlags = 0
        if flags & FXF_READ == FXF_READ and flags & FXF_WRITE == 0:
            openFlags = os.O_RDONLY
        if flags & FXF_WRITE == FXF_WRITE and flags & FXF_READ == 0:
            openFlags = os.O_WRONLY
        if flags & FXF_WRITE == FXF_WRITE and flags & FXF_READ == FXF_READ:
            openFlags = os.O_RDWR
        if flags & FXF_APPEND == FXF_APPEND:
            openFlags |= os.O_APPEND
        if flags & FXF_CREAT == FXF_CREAT:
            openFlags |= os.O_CREAT
        if flags & FXF_TRUNC == FXF_TRUNC:
            openFlags |= os.O_TRUNC
        if flags & FXF_EXCL == FXF_EXCL:
            openFlags |= os.O_EXCL
        if "permissions" in attrs:
            mode = attrs["permissions"]
            print "SFTPFile permissions"
            del attrs["permissions"]
        else:
            mode = 0777
        fd = os.open(filename, openFlags, mode)
        print "sftpfilename", filename
        if attrs:
            server._setAttrs(filename, attrs)
        self.fd = fd
        if openFlags & os.O_RDONLY:
            self.f = file_watching.WatchingFileWrapper.wrap_fd_read(fd)
        elif openFlags & os.O_WRONLY:
            self.f = file_watching.WatchingFileWrapper.wrap_fd_write(fd)

    def close(self):
        if self.f:
            return self.f.close()
        else:
            return os.close(self.fd)

    def readChunk(self, offset, length):
        if self.f:
            self.f.seek(offset)
            return self.f.read(length)
        else:
            os.lseek(self.fd, offset, 0)
            return os.read(self.fd, length)

    def writeChunk(self, offset, data):
        if self.f:
            self.f.seek(offset)
            return self.f.write(data)
        else:
            os.lseek(self.fd, offset, 0)
            return os.write(self.fd, data)

    def _getAttrs(self, s):
        return {
            "size" : s.st_size,
            "uid" : s.st_uid,
            "gid" : s.st_gid,
            "permissions" : int(s.st_mode),
            "atime" : int(s.st_atime),
            "mtime" : int(s.st_mtime)
        }

    def getAttrs(self):
        print "getattrs-san", self.fd
        s = os.fstat(self.fd)
        return self._getAttrs(s)

    def setAttrs(self, attrs):
        raise NotImplementedError


class SFTPDirectory:

    def __init__(self, server, path):
        self.server = server
        self.files = path.listdir()
        print "SFTPDirectory", self.files
        self.path = path

    def _getAttrs(self, s):
        print s
        return {
            "size" : s.st_size,
            "uid" : s.st_uid,
            "gid" : s.st_gid,
            "permissions" : int(s.st_mode),
            "atime" : int(s.st_atime),
            "mtime" : int(s.st_mtime)
        }

    def __iter__(self):
        return self

    def next(self):
        try:
            f = self.files.pop(0)
            print "next", f
        except IndexError:
            raise StopIteration
        else:
            s = os.lstat(self.path.child(f).path)
            longname = lsLine(f, s)
            attrs = self._getAttrs(s)
            print attrs
            return (f, longname, attrs)

    def close(self):
        self.files = []


components.registerAdapter(SFTPServerForFKUploadConchUser, FKUploadConchUser, filetransfer.ISFTPServer)


import os
from twisted.application import service, internet
from twisted.conch.ssh.keys import Key
from twisted.conch.ssh.factory import SSHFactory
from twisted.cred.checkers import ICredentialsChecker
from twisted.cred.credentials import IUsernamePassword
from twisted.cred.portal import Portal
from twisted.internet import reactor
import djangoauth


def get_key(path):
    return Key.fromString(data=open(path).read())

def start_sftp(port, root):
    root = os.path.expanduser(root)

    # make with: ckeygen -b 2048 -t rsa -f id_rsa
    public_key = get_key('id_rsa.pub')
    private_key = get_key('id_rsa')

    factory = SSHFactory()
    factory.privateKeys = {'ssh-rsa': private_key}
    factory.publicKeys = {'ssh-rsa': public_key}
    #realm = ftp_test.UploadFTPRealm(None)
    realm = UploadSFTPRealm()
    realm.root = root

    factory.portal = Portal(realm)
    checker = djangoauth.DjangoAuthChecker()
    factory.portal.registerChecker(checker)
    reactor.listenTCP(port, factory)
    reactor.run()

if __name__ == '__main__':
    start_sftp()
    reactor.run()