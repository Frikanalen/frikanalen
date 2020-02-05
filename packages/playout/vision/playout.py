import datetime
import importlib
import logging
import os
import weakref

import zope.interface
from twisted.internet import reactor
from twistedschedule.interfaces import ISchedule
from twistedschedule.task import ScheduledCall

from vision import clock
from vision import jukebox
from vision import playlist
from vision.configuration import configuration


# TODO: Ident, loop, etc should be full program obects and not be
# hardcoded in playout.py
# TODO: This part of the code should _only_ concern itself with relative paths.
IDENT_LENGTH = 27.0
#IDENT_FILENAME = os.path.join(configuration.ident_media_root,
#                              'FrikanalenVignett.avi')
#LOOP_FILENAME = os.path.join(configuration.ident_media_root,
#                             'FrikanalenLoop.avi')
IDENT_FILENAME = 'filler/FrikanalenVignett.avi'
LOOP_FILENAME = 'filler/FrikanalenLoop.avi'
# make sure we have the basic required files
#os.stat(IDENT_FILENAME)
#os.stat(LOOP_FILENAME)


@zope.interface.implementer(ISchedule)
class Playout(object):

    def __init__(self, service, player_class=None):
        if player_class is None:
            player_class = configuration.player_class
        self.player = _get_class(player_class)(LOOP_FILENAME)
        self.random_provider = jukebox.RandomProvider()
        self.service = service
        self.service.playout = self

        self.schedule = None
        self.next_program = None
        self.playing_program = None
        # A reference to the timed callback which aborts programs
        self.duration_call = None
        self.delayed_start_call = None
        # Still filename, if being displayed
        self.still = None
        # Temporary stack for sequence of videos before going to on_idle
        self.on_end_call_stack=[]

    def set_schedule(self, schedule):
        "Set schedule and start playing"
        self.schedule = schedule
        self.scheduler_task = ScheduledCall(self.cue_next_program)
        self.scheduler_task.start(self)
        self.service.on_set_schedule(schedule)
        if not self.playing_program:
            self.resume_playback()

    def resume_current_program(self):
        current_program = self.playing_program
        if current_program:
            self.cue_program(current_program, current_program.seconds_since_playback())

    def resume_playback(self):
        # TODO: Rename to resume_schedule
        current_program = self.schedule.get_current_program()
        if current_program:
            self.cue_program(current_program, current_program.seconds_since_playback())
        else:
            self.on_idle()

    def cue_next_program(self):
        """Starts the next program

        Set the next program with Playout.set_next_program"""
        if self.next_program:
            self.cue_program(self.next_program)
            self.next_program = None

    def _cancel_pending_calls(self):
        """Stops any pending calls from starting in the future (and disrupt playback)

        This is used whenever a program is started and new calls will be registered
        """
        if self.duration_call and not self.duration_call.called:
            self.duration_call.cancel()
            self.duration_call = None
        if self.delayed_start_call and not self.delayed_start_call.called:
            self.delayed_start_call.cancel()
            self.delayed_start_call = None

    def cue_program(self, program, resume_offset=0):
        """Starts the given program"""
        self._cancel_pending_calls()
        duration_text = "Unknown"
        if program.playback_duration == float("inf"):
            duration_text = "Infinite"
        elif program.playback_duration:
            duration_text = "%i:%02i" % (program.playback_duration / 60, program.playback_duration % 60)
            # Schedule next call
            delta = program.playback_duration-resume_offset
            if delta <= 0.0:
                self.player.pause_screen()
            else:
                self.duration_call = reactor.callLater(delta, self.on_program_ended)
        logging.info("Playback video_id=%i, offset=%s+%ss name='%s' duration=%s" % (
            program.media_id,
            str(program.playback_offset), str(resume_offset), program.title, duration_text))
        # Start playback
        self.player.play_program(program, resume_offset=resume_offset)
        self.service.on_playback_started(program)
        self.playing_program = program

    def set_next_program(self, program):
        self.next_program = program
        self.service.on_set_next_program(program)
        if program:
            logging.info("Next scheduled video_id=%i @ %s" % (
                program.media_id, program.program_start))
        else:
            logging.warning("Scheduled nothing")

    # ISchedule.getDelayForNext
    def getDelayForNext(self):
        # Queue next
        program = self.schedule.get_next_program()
        if program == None:
            self.scheduler_task.stop()
            self.set_next_program(None)
            # This will actually call cue_next_program once more.
            logging.warning("Program schedule empty")
            return 0.0
        self.set_next_program(program)
        return program.seconds_until_playback()

    def stop_schedule(self):
        if self.scheduler_task and self.scheduler_task.running:
            self.scheduler_task.stop()
        #self.set_next_program(None)

    def start_schedule(self):
        self.stop_schedule()
        self.scheduler_task = ScheduledCall(self.cue_next_program)
        self.scheduler_task.start(self)

    def show_still(self, filename="stills/tekniskeprover.png"):
        self._cancel_pending_calls()
        self.stop_schedule()
        self.player.show_still(filename)
        self.service.on_still(filename)
        logging.info("Show still: %s", filename)

    def cancel_still(self):
        logging.info("Cancel still")
        self.service.on_still("")
        self.start_schedule()
        # TODO: resume_current_program?
        self.resume_playback()

    def on_program_ended(self):
        """
        try:
            logging.debug("Video '%s' #%i ended with %.1fs left. " % (
                self.playing_program.title, self.playing_program.media_id,
                self.player.seconds_until_end_of_playing_video())
                )
            pass
        # TODO: Add proper exception/exceptionlogging
        except:
            logging.warning("Excepted while trying to log on_program_ended")
        """
        if self.on_end_call_stack:
            func = self.on_end_call_stack.pop(0)
            func()
        else:
            self.on_idle()

    def play_jukebox(self):
        logging.info("Jukebox playback start")
        program = self.schedule.new_program()
        limit = 90*60 # 90 minutes long programs max
        if self.next_program:
            limit = min(limit, self.next_program.seconds_until_playback())
        video = self.random_provider.get_random_video(limit)
        program.set_program(
            media_id=video["media_id"],
            program_start=clock.now(),
            playback_duration=video["duration"],
            title=video["name"])
        self.cue_program(program)

    def play_ident(self):
        logging.info("Ident playback start")
        program = self.schedule.new_program()
        program.set_program(
            media_id=-1,
            program_start=clock.now(),
            playback_duration=IDENT_LENGTH,
            title="Frikanalen Vignett",
            filename=IDENT_FILENAME)
        self.cue_program(program)

    def on_idle(self):
        time_until_next = float("inf")
        if self.next_program:
            time_until_next = self.next_program.seconds_until_playback()
        # The rules.
        use_jukebox = configuration.jukebox
        use_jukebox &= time_until_next > (120+IDENT_LENGTH)
        use_jukebox &= self.random_provider.enough_room(time_until_next)
        if use_jukebox:
            loop_length = 12.0
            PAUSE_LENGTH = IDENT_LENGTH+loop_length
            logging.info("Pause before jukebox: %.1fs" % PAUSE_LENGTH)
            program = self.schedule.new_program()
            program.set_program(-1,
                program_start=clock.now(),
                playback_duration=loop_length,
                title="Jukebox pause screen",
                filename=LOOP_FILENAME,
                loop=True)
            self.cue_program(program)
            self.on_end_call_stack.append(self.play_ident)
            self.on_end_call_stack.append(self.play_jukebox)
        elif time_until_next >= 12+IDENT_LENGTH:
            logging.info("Pause idle: %.1fs" % time_until_next)
            PAUSE_LENGTH = time_until_next
            program = self.schedule.new_program()
            program.set_program(-1,
                program_start=clock.now(),
                playback_duration=time_until_next-IDENT_LENGTH,
                title="Pause screen",
                filename=LOOP_FILENAME,
                loop=True)
            self.cue_program(program)
            self.on_end_call_stack.append(self.play_ident)
        else:
            logging.info("Short idle: %.1fs" % time_until_next)
            # Show pausescreen
            program = self.schedule.new_program()
            t = None
            if self.next_program:
                t = self.next_program.seconds_until_playback()
            program.set_program(-1, program_start=clock.now(), playback_duration=t, title="Pause screen", filename=LOOP_FILENAME, loop=True)
            #self.cue_program(program) # TODO: Doesn't handle looping
            self.player.pause_screen()
            self.playing_program = program
            self.service.on_playback_started(program)


class PlayoutService(object):
    def __init__(self):
        self.observers = weakref.WeakKeyDictionary()

    def add_observer(self, observer):
        self.observers[observer] = True
        observer.on_playback_started(self.playout.playing_program)
        observer.on_set_next_program(self.playout.next_program)
        if self.playout.still:
            observer.on_still(self.playout.still)

    def remove_observer(self, observer):
        del self.observers[observer]

    def on_playback_started(self, program):
        for each in list(self.observers.keys()):
            each.on_playback_started(program)

    def on_still(self, name):
        for each in list(self.observers.keys()):
            each.on_still(name)

    def on_set_schedule(self, program):
        for each in list(self.observers.keys()):
            each.on_set_schedule(program)

    def on_set_next_program(self, program):
        for each in list(self.observers.keys()):
            each.on_set_next_program(program)


def start_test_player():
    log_fmt = (
        "%(asctime)s %(levelname)s:%(name)s %(filename)s:%(lineno)d "
        "%(message)s")
    logging.basicConfig(level=logging.DEBUG, format=log_fmt)
    service = PlayoutService()

    schedule = playlist.Schedule()
    v = schedule.new_program()
    v.set_program(1758, clock.now() - datetime.timedelta(0, 5), title="First",
                  playback_offset=10, playback_duration=10.0)
    schedule.add(v)
    for n in range(1):
        delta = datetime.timedelta(0, 6+(n)*10.0)
        v = schedule.new_program()
        v.set_program(1758, clock.now() + delta, title="No %i" % n,
                      playback_offset=30+60*n, playback_duration=9.0)
        print(("Added %i @ %s" % (n, v.program_start)))
        schedule.add(v)
    player = Playout(service)
    player.set_schedule(schedule)
    # import playoutweb
    # playoutweb.start_web(None, playout_service=service, playout=player,
    #                      schedule=schedule, port=8888)
    reactor.callLater(4.0, player.show_still)
    reactor.callLater(7.0, player.cancel_still)
    return player


def _get_class(cls):
    mod_path, cls_name = cls.split(':')
    module = importlib.import_module(mod_path)
    return getattr(module, cls_name)


if __name__ == '__main__':
    start_test_player()
    reactor.run()
