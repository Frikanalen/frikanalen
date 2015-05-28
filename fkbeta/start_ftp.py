#!/bin/env python
FKFTP_LOG_PATH 		= "./log/ftp.log"
FKFTP_LOG_TO_STDOUT = True
FKFTP_LOG_TO_FILE   = False

FKFTP_ROOT 			= "~/upload"
FKFTP_ENABLE_FTP	= True
FKFTP_FTP_PORT 		= 2100
FKFTP_ENABLE_SFTP   = False      # SFTP implementation is not regarded as safe. Use with caution.
FKFTP_SFTP_PORT 	= 2200
#FKFTP_USE_DJANGO_AUTH = False

FKBROKER_PUBLISH    = "tcp://localhost:11000"
FKBROKER_SUBSCRIBE  = "tcp://localhost:11001"
FKFTP_TOPIC         = "no.frikanalen.dev." + "fkftp."
FKFTP_NODENAME      = "development1"


if __name__ == '__main__':
	import os, sys

	assert FKFTP_TOPIC.endswith('.'), "FKFTP_TOPIC must end with '.'"

	# setup logging
	from twisted.python import log, logfile
	original_stdout = sys.stdout
	if FKFTP_LOG_TO_FILE:
		log.startLogging(logfile.DailyLogFile.fromFullPath(FKFTP_LOG_PATH))
	if FKFTP_LOG_TO_STDOUT:
		log.startLogging(original_stdout)
	from twisted.internet import reactor

	# Set up django settings before we start anything up
	os.environ["DJANGO_SETTINGS_MODULE"] = "settings"
	os.environ["DJANGO_SETTINGS_MODULE"] = "fkbeta.settings.local"

	import django
	django.setup()

	FKFTP_ROOT = os.path.expanduser(FKFTP_ROOT)

	from fkftp import zmq_reporter
	zmq_reporter = zmq_reporter.ZMQUploadReporter(FKBROKER_PUBLISH, FKBROKER_SUBSCRIBE, FKFTP_TOPIC, FKFTP_NODENAME, FKFTP_ROOT)

	# Start servers
	if FKFTP_ENABLE_FTP:
	    from fkftp import ftp_server
	    ftp_server.start_ftp(port=FKFTP_FTP_PORT, root=FKFTP_ROOT, zmq_reporter=zmq_reporter)

	if FKFTP_ENABLE_SFTP:
	    from fkftp import sftp_server
	    sftp_server.start_sftp(port=FKFTP_SFTP_PORT, root=FKFTP_ROOT)

	reactor.run()
