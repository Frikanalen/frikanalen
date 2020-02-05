import mimetypes
#mimetypes.init()
import logging
import datetime
import os
import json
from twisted.web.server import Site
from twisted.web.resource import Resource, IResource
from twisted.web.static import File
#File.contentTypes = mimetypes.types_map
File.contentTypes.update(
        {
            '.apng':  'image/png',
        })
from twisted.internet import reactor
from twisted.internet.protocol import ClientCreator
from twisted.web.client import getPage
from . import clock
from . import playlist

class SchedulesPage(Resource):
    def __init__(self, schedule):
        self.schedule = schedule

    def render_GET(self, request):
        if not request.args.get("date"):
            date = clock.now().date()
        else:
            y, m, d = request.args["date"][0].split('-')
            date = datetime.date(year=int(y), month=int(m), day=int(d))
        l = self.schedule.get_programs_by_date(date, as_dict=True)
        d = {"date": "%i-%i-%i" % (date.year, date.month, date.day), "schedule": l}
        s = json.dumps(d)
        return s

class StillsListPage(Resource):
    def __init__(self, path):
        self.path = path

    def render_GET(self, request):
        l = os.listdir(self.path)
        l = [{"filename":fn} for fn in l]
        s = json.dumps(l)
        return s.encode("utf-8")

# TODO: There's no security. Use proper websocket-rpc instead of this silly protocol
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol

class PlayoutWebsocketProtocol(WebSocketServerProtocol):
    def __init__(self, service, playout=None, schedule=None):
        super().__init__()
        self.service = service
        self.playout = playout
        self.schedule = schedule
        self.random_provider = playout.random_provider

    def onMessage(self, frame, binary):
        cmd = frame[:frame.find(b":")]
        arg = frame[frame.find(b":")+2:]
        logging.info("Command from web: %s" % (repr(frame)))
        if cmd == "display-still":
            self.playout.show_still("stills/"+arg)
        elif cmd == "cancel-still":
            self.playout.cancel_still()
        elif cmd == "play-mediaid":
            argl = arg.split(' ')
            media_id = int(argl[0])
            offset = float(argl[1])
            duration = float(argl[2])
            p = playlist.Program()
            p.set_program(media_id, program_start=clock.now(), playback_offset=offset, playback_duration=duration, title="%i direct play media" % media_id)
            # TODO: Move to service ?
            self.playout.cue_program(p)
        elif cmd == "resume-playback":
            # TODO: Rename to resume schedule?
            self.playout.resume_playback()
            self.playout.start_schedule()
        elif cmd == "resume-current-program":
            self.playout.resume_current_program()
        elif cmd == "clear-next-program":
            self.playout.set_next_program(None)
            self.playout.stop_schedule()
        elif cmd == "set-next-program-from-schedule":
            self.playout.start_schedule()
        elif cmd == "reload-schedule":
            self.schedule.update_from_pg_cache(days=14)
            self.random_provider.reload()
            self.service.on_set_schedule(None)
            self.playout.start_schedule()

    def onOpen(self):
        if not self.service:
            return
        self.service.add_observer(self) # Will get a lot of info from here
        self.sendMessage(("time: %s" % (clock.now().ctime(),)).encode('utf-8'))

    def onClose(self, wasClean, code, reason):
        self.service.remove_observer(self)

    def on_playback_started(self, program):
        if not program:
            program = self.schedule.new_program()
            program.set_program(-1, program_start=clock.now(), title="*** Dead Air ***", playback_duration=float("inf"))
            self.sendMessage(b"next: %s" % program.json())
            logging.warning("playing '*** Dead Air ***' sent to webbrowser")
        else:
            self.sendMessage(b"playing: %s" % program.json())

    def on_set_schedule(self, schedule):
        self.sendMessage(b"schedule-updated: %s" % clock.now().ctime())

    def on_set_next_program(self, program):
        if not program:
            # TODO: Set next-start, if possible, to duration-progress
            program = self.schedule.new_program()
            program.set_program(-1, program_start=clock.now(), title="*** Dead Air ***", playback_duration=float("inf"))
            self.sendMessage(b"next: %s" % program.json())
            logging.warning("next-program '*** Dead Air ***' sent to webbrowser")
        else:
            self.sendMessage(b"next: %s" % program.json())

    def on_still(self, name):
        self.sendMessage(b"still: %s" % name)



from telelib.commonweb import simple_guard_resource
def start_web(localEPG=None, playout_service=None, playout=None, port=8888, schedule=None):
    root = File('web')
    if schedule:
        root.putChild("schedules", SchedulesPage(schedule))
        root.putChild("player_snapshots", File('cache/snapshots'))
    root.putChild("stills", StillsListPage("stills"))
    wrapper = simple_guard_resource(root)
    site = Site(wrapper)
    reactor.listenTCP(port, site)


    factory = WebSocketServerFactory()
    factory.protocol = lambda: PlayoutWebsocketProtocol (playout_service, playout, schedule)
    reactor.listenTCP(8889, factory)

    """
    import playout_autobahn
    from autobahn import AutobahnServerFactory, AutobahnServerProtocol
    factory = AutobahnServerFactory()
    factory.protocol = lambda: playout_autobahn.AutobahnServerProtocol (playout_service, playout, schedule)
    reactor.listenTCP(8899, factory)
    """


if __name__=="__main__":
    #localEPG = epgget.LocalEPG()
    #localEPG.load_cache()
    schedule = playlist.Schedule()
    schedule.update_from_pg_cache(days=14)
    start_web(schedule=schedule)
    reactor.run()
