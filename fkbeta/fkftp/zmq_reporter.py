import time
import pprint
import json
from txzmq import ZmqEndpoint, ZmqFactory, ZmqPubConnection, ZmqSubConnection
from twisted.python import filepath
from twisted.internet import reactor

class ZMQUploadReporter:
    def __init__(self, broker_publish_uri, broker_subscribe_uri, topic, nodename, root):
        self.broker_publish_uri = broker_publish_uri
        self.broker_subscribe_uri = broker_subscribe_uri
        self.topic = topic
        self.nodename = nodename

        zf = ZmqFactory()
        e = ZmqEndpoint("connect", broker_publish_uri)
        self.pub_cxn = ZmqPubConnection(zf, e)

        e = ZmqEndpoint("connect", broker_subscribe_uri)
        self.sub_cxn = ZmqSubConnection(zf, e)
        self.sub_cxn.subscribe(self.topic)
        self.sub_cxn.gotMessage = self.got_message

        self.root = filepath.FilePath(root)
        self.send_filelist()
        self.send_heartbeat(0)

    def send_heartbeat(self, n):
        d = {"count": n}
        self.send_message("heartbeat", d)
        reactor.callLater(60, self.send_heartbeat, n + 1)

    def _user_and_filename_from_filepath(self, p):
        l = p.segmentsFrom(self.root)
        if len(l) == 1:
            return None, l[0] # File is in the root
        else:
            username = l[0]
            path = '/'.join(l)
            return username, path

    def relative_filename(self, p):
        l = p.segmentsFrom(self.root)
        return '/'.join(l)

    def send_filelist(self):
        l = []
        for p in self.root.walk():
            if p.isfile():
                username, path = self._user_and_filename_from_filepath(p)
                d = {}
                d["filename"] = path
                d["username"] = username
                d["size"] = p.getsize()
                d["last_write_at"] = p.getModificationTime()
                l.append(d)
        self.send_message("files.refresh", l)
        reactor.callLater(10, self.send_filelist)

    def send_message(self, topic_postfix, msg):
        topic = self.topic+topic_postfix
        full_msg = {
            "msg": msg,
            "username": self.nodename,
            "topic": topic,
            "timestamp": time.time()
            }
        #print pprint.pformat(full_msg)
        self.pub_cxn.publish(json.dumps(full_msg), topic)

    def got_message(self, msg, topic):
        print "RX", repr(topic), repr(msg)
        if topic == self.topic + ".upload.ingest":
            if msg["msg"]["nodename"] == self.nodename:
                self.sub_cxn.publish(self.topic + ".filelist")