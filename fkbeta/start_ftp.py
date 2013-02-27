
if __name__ == '__main__':
    import os
    from twisted.python import log, logfile
    #log.startLogging(logfile.DailyLogFile.fromFullPath("/code/fkbeta/logs/ftp/ftp.log"))
    from twisted.internet import reactor
    os.environ["DJANGO_SETTINGS_MODULE"] = "settings"
    from fkftp import ftp_server
    ftp_server.start_ftp(port=2100, root="/depot/upload")
    reactor.run()