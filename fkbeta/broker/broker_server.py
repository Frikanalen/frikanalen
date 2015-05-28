"""
Django companion

This is a broker which takes commands from Django, events from the periphery and make changes to the django database.
"""
import json 
import pprint
from txzmq import ZmqEndpoint, ZmqFactory, ZmqPubConnection, ZmqSubConnection

"""commands:

from django: 
ingest_from_upload(username, filename)

from ftp:
update_

"""
import json
import datetime
import pytz
from twisted.internet import reactor
from django.core.exceptions import ObjectDoesNotExist
from media_processor.models import MediaUpload
from fk.models import User

class Broker:
	def __init__(self, port):
		self.port = port
		self.zmq_factory = ZmqFactory()
		e = ZmqEndpoint("bind", "tcp://127.0.0.1:" + str(port))
		#e = ZmqEndpoint("connect", "tcp://hub.fedoraproject.org:9940")
		self.sub_cxn = ZmqSubConnection(self.zmq_factory, e)
		self.sub_cxn.subscribe("")
		self.sub_cxn.gotMessage = self.got_message

		e = ZmqEndpoint("bind", "tcp://127.0.0.1:" + str(port+1))
		self.pub_cxn = ZmqPubConnection(self.zmq_factory, e)

	def got_message(self, data, tag):
		msg = json.loads(data)
		if tag.endswith(".heartbeat"):
			print "heartbeat from " + tag + " " + msg["username"] + " nr " + str(msg["msg"]["count"])
		elif tag.endswith("fkftp.files.refresh"):
			filelist = msg["msg"]
			for mediafile in filelist:
				try:
					m = MediaUpload.objects.get(filename=mediafile["filename"])
				except ObjectDoesNotExist:
					m = MediaUpload()
				m.filename = mediafile["filename"]
				m.size = mediafile["size"]
				m.last_write_at = datetime.datetime.fromtimestamp(mediafile["last_write_at"], pytz.utc)
				try:
					m.uploader = User.objects.get(username=mediafile["username"])
				except ObjectDoesNotExist:
					pass
				m.nodename = msg["username"]
				m.save()
		else:
			print tag
			print pprint.pformat(msg)
		self.pub_cxn.publish(data, tag)


def start_broker(port):
	broker = Broker(port)
	return broker

class BrokerTester:
	message = '{"msg":"test message"}'
	def __init__(self, port):
		print "Self-test"
		zf = ZmqFactory()
		e = ZmqEndpoint("connect", "tcp://127.0.0.1:" + str(port))
		self.pub_cxn = ZmqPubConnection(zf, e)

		e = ZmqEndpoint("connect", "tcp://127.0.0.1:" + str(port+1))
		self.sub_cxn = ZmqSubConnection(zf, e)
		self.sub_cxn.subscribe("")
		self.sub_cxn.gotMessage = self.got_message

	def do_test(self):
		self.pub_cxn.publish(self.message)

	def got_message(self, msg, tag):
		assert self.message == msg

def self_test(broker):
	return BrokerTester(broker.port)

