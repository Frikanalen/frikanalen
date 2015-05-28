import os 
import time
import hashlib
from twisted.python import log

class TransferTypeUpload:
    prefix = "upload"
class TransferTypeDownload:
    prefix = "download"
class TransferTypeUnknown:
    prefix = "unknown"

class WatchingFileWrapper(object):
    """Wrapper for watching file/fd reads or writes"""
    def __init__(self, f, transfer_type = TransferTypeUnknown, do_hashing=True, filepath=None):
        self.f = f
        self.filepath = filepath 
        print filepath
        #self.pos = 0 # But we don't really need to track the position, yet
        # Stats
        self.open_time = time.time()
        self.close_time = None
        self.bytes_read = 0
        self.bytes_written = 0
        self.transfer_type = transfer_type
        # Hashing
        self.is_hashing = do_hashing
        if self.is_hashing:
            self.hash = {"md5": hashlib.md5(), "sha1": hashlib.sha1(), "sha256": hashlib.sha256()}
        else:
            self.hash = {}

    @classmethod
    def wrap_fd_read(cls, fd):
        f = os.fdopen(fd, "rt")
        log.msg("Opened for read", f, debug=True)
        return cls(f, TransferTypeDownload)

    @classmethod
    def wrap_fd_write(cls, fd):
        f = os.fdopen(fd, "wt")
        log.msg("Opened for write", f, debug=True)
        return cls(f, TransferTypeUpload)

    def write(self, *args):
        if len(args) > 1:
            log.msg(">1 args to .write", len(args), debug=True)
        self.bytes_written += sum([len(arg) for arg in args])

        for algo in self.hash.keys():
            self.hash[algo].update(args[0])

        return self.f.write(*args)

    def read(self, bytes):
        self.bytes_read += bytes
        return self.f.read(bytes)

    def seek(self, *args):
        assert 0, "seek not tested"
        self.is_hashing = False # Give up hashing
        return self.f.seek(*args)

    def close(self):
        self.close_time = time.time()
        td = self.close_time - self.open_time

        res = self.f.close()
        name = repr(self.f.name)
        log.msg("%s closed" % (name), debug=True)
        log.msg("%s Read %i bytes Wrote %i bytes" % (name, self.bytes_read, self.bytes_written), debug=True)
        if td > 0:
            log.msg("%s Readspeed %.1f MB/s Writespeed %.1f MB/s" % (name, self.bytes_read / td / 1e6, self.bytes_written / td / 1e6), debug=True)
        if self.bytes_written > 0:
            for algo_name, algo in self.hash.items():
                print "%s %s %s" % (name, algo_name, algo.hexdigest())
        return res

class ReportingFileWrapper(WatchingFileWrapper):
    last_report = None

    def read(self, *args):
        res = super(self.__class__, self).read(*args)                
        if not self.last_report or (time.time() - self.last_report > 2.0):
            report = {
                "action": "read",
                }
            self.submit_report("file."+self.transfer_type.prefix, report)
            self.last_report = time.time()
        return res

    def write(self, *args):
        res = super(self.__class__, self).write(*args)        
        if not self.last_report or (time.time() - self.last_report > 2.0):
            report = {
                "action": "write",
                "state":  "uploading",
                }
            self.submit_report("file."+self.transfer_type.prefix, report)
            self.last_report = time.time()
        return res

    def close(self):
        res = super(self.__class__, self).close()
        report = {
            "action": "close",
            }
        if self.transfer_type is TransferTypeUpload:
            report["state"] = "upload_maybe_complete"
        self.submit_report("file."+self.transfer_type.prefix, report)
        return res

    def submit_report(self, postfix, report):
        filename = self.f.name
        report.update({
            "username":      self.avatarId.username, 
            "filename":      self.zmq_reporter.relative_filename(self.filepath),
            "bytes":         os.path.getsize(filename),
            "last_write_at": os.path.getmtime(filename),
            })
        if self.is_hashing:
            report.update({
                "hash_md5":      self.hash["md5"].hexdigest(),
                "hash_sha1":     self.hash["sha1"].hexdigest(),
                "hash_sha256":   self.hash["sha256"].hexdigest(),
            })
        self.zmq_reporter.send_message(postfix, report)
