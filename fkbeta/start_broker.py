# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

if __name__ == '__main__':
	import os
	import sys
	import argparse
	parser = argparse.ArgumentParser(description="")
	parser.add_argument("-t", "--test", action="store_false")
	args = parser.parse_args()

	os.environ["DJANGO_SETTINGS_MODULE"] = "fkbeta.settings.local"
	import django
	django.setup()

	from twisted.internet import reactor
	from twisted.python import log, logfile
	#log.startLogging(logfile.DailyLogFile.fromFullPath("/code/fkbeta/logs/broker.log"))
	from broker import broker_server

	port = 11000

	broker = broker_server.start_broker(port)

	if args.test:
		tester = broker_server.self_test(broker)
		reactor.callLater(0.1, tester.do_test)

	reactor.run()
