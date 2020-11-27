import datetime
import importlib
import logging
import os
import weakref

import zope.interface
from twistedschedule.interfaces import ISchedule

from twisted.internet import reactor
from twistedschedule.task import ScheduledCall

from scheduler import clock
from vision import jukebox
from scheduler import Schedule, Program
from vision.configuration import configuration
from database import schedulestore

from twisted.logger._levels import LogLevel

def panic_on_unhandled_exception(event):
    if event.get("log_level") == LogLevel.critical:
        print ("Stopping for: ", event)
        reactor.stop()

# TODO: Ident, loop, etc should be full program obects and not be
# hardcoded in playout.py
# TODO: This part of the code should _only_ concern itself with relative paths.
IDENT_LENGTH = 27.0
IDENT_FILENAME = 'filler/FrikanalenLoop.avi' # less noise while developing :)
LOOP_FILENAME = 'filler/FrikanalenLoop.avi'

@zope.interface.implementer(ISchedule)
class Playout(object):
    # ISchedule.getDelayForNext
    # This is called by ScheduledCall to determine the number
    # of seconds until the next time self.cue_next_program is
    # invoked
    def getDelayForNext(self):
        # Queue next
        next_program = self.schedule.get_next_program()
        if next_program == None:
            self.scheduler_task.stop()
            self.set_next_program(None)
            # This will actually call cue_next_program once more.
            logging.warning("Program schedule empty")
            return 0.0
        self.set_next_program(next_program)
        return next_program.seconds_until_playback()

    def __init__(self, player_class=None):
        if player_class is None:
            player_class = configuration.playerClass
        self.player = _get_class(player_class)(LOOP_FILENAME)
        self.random_provider = jukebox.RandomProvider()

        self.schedule = None
        self.next_program = None
        self.playing_program = None

        # The video_end_timeout is invoked at a video's end time because
        # the current architecture does not receive media end messages
        # from CasparCG
        self.video_end_timeout = None

        # Temporary stack for sequence of videos before going to on_idle
        self.programEndCallbackStack=[]

    def load_schedule(self):
        "Set schedule and start playing"
        logging.debug("Attaching schedule")
        self.schedule = schedulestore.load(clock.now().date(), numDays=1)

        self.start_schedule()
        self.self_pending_refresh = reactor.callLater(60*60, self.load_schedule)

        if not self.playing_program:
            self.resume_schedule()

    def resume_current_program(self):
        current_program = self.schedule.get_current_program()
        logging.debug("in resume_current_program; current_program=%s", current_program)
        if current_program:
            logging.debug("resume_current_program invoking cue_program({})".format(current_program))
            self.cue_program(current_program, current_program.seconds_since_scheduled_start())

    def resume_schedule(self):
        """Resumes the currently scheduled program if there is one,
        otherwise it goes into idle mode"""

        if self.schedule.get_current_program():
            self.resume_current_program()
        else:
            self.on_idle()

    def cue_next_program(self):
        """Starts the next program

        Set the next program with Playout.set_next_program"""
        logging.debug("In cue_next_program - self.next_program=%s", self.next_program)
        if self.next_program:
            self.cue_program(self.next_program)
            self.next_program = None

    def _clear_timeouts(self):
        """Clears any previously set timeouts"""
        logging.debug("in _clear_timeouts")
        if self.video_end_timeout and not self.video_end_timeout.called:
            logging.debug("clearing timeouts")
            self.video_end_timeout.cancel()
            self.video_end_timeout = None
        else:
            logging.debug("not clearing timeout")

    def _fmt_duration(self, duration):
        if duration == float("inf"):
            return "Infinite"

        return "%i:%02i" % (duration / 60, duration % 60)

    def cue_program(self, program, seekSeconds=0):
        logging.debug("In cue_program, program={}, offset={}".format(program, seekSeconds))
        logging.debug("schedule.programs = %s", self.schedule.programs)
        # Clear any timeouts set for the previous program
        self._clear_timeouts()

        if program.playback_duration != float("inf"):
            secondsUntilEnd = program.playback_duration - seekSeconds

            if secondsUntilEnd <= 0.0:
                errormsg = """secondsUntilEnd == {} for program {}"""
                logging.error(errormsg.format(secondsUntilEnd, program))
            else:
                errormsg = """secondsUntilEnd == {} for program {}"""
                logging.debug(errormsg.format(secondsUntilEnd, program))
                self.video_end_timeout = reactor.callLater(secondsUntilEnd, self.on_program_ended)

        if seekSeconds > 0:
            logging.info("Playing program {}, seeking {}s".format(program, seekSeconds))
        else:
            logging.info("Playing program {}".format(program))

        # Start playback
        self.player.play_program(program, resume_offset=seekSeconds)
        self.playing_program = program

    def set_next_program(self, program):
        self.next_program = program
        if program:
            logging.info("Next scheduled video_id=%i @ %s" % (
                program.media_id, program.program_start))
        else:
            logging.warning("Scheduled nothing")

    def stop_schedule(self):
        logging.info("Stopping schedule")
        try:
            if self.scheduler_task.running:
                self.scheduler_task.stop()
        except AttributeError:
            pass

    def start_schedule(self):
        logging.info("Starting schedule (will stop the old one if it exists)")
        self.stop_schedule()
        self.scheduler_task = ScheduledCall(self.cue_next_program)
        self.scheduler_task.start(self)

    def on_program_ended(self):
        logging.debug("on_program_ended invoked")

        if self.programEndCallbackStack:
            self.programEndCallbackStack.pop(0)()
        else:
            self.on_idle()

    def play_jukebox(self):
        logging.info("Jukebox playback start")
        limit = 90*60 # 90 minutes long programs max
        if self.next_program:
            limit = min(limit, self.next_program.seconds_until_playback())
        video = self.random_provider.get_random_video(limit)
        program = Program(
            media_id=video["media_id"],
            program_start=clock.now(),
            playback_duration=video["duration"],
            title=video["name"])
        logging.debug("jukebox invoking cue_program({})".format(program))
        self.cue_program(program)

    def play_ident(self):
        logging.info("Ident playback start [skipped]")
        program = Program(
            media_id=-1,
            program_start=clock.now(),
            playback_duration=2, #IDENT_LENGTH,
            title="Frikanalen Vignett",
            filename=IDENT_FILENAME)
        logging.debug("play_ident invoking cue_program({})".format(program))
        self.cue_program(program)

    def on_idle(self):
        time_until_next = float("inf")
        if self.next_program:
            time_until_next = self.next_program.seconds_until_playback()
        logging.info("on_idle is invoked, with %.1fs left until next item" %\
               (time_until_next,))
        # The rules.
        use_jukebox = configuration.useJukebox
        use_jukebox &= time_until_next > (120+IDENT_LENGTH)
        use_jukebox &= self.random_provider.enough_room(time_until_next)
        if use_jukebox:
            loop_length = 12.0
            #PAUSE_LENGTH = IDENT_LENGTH+loop_length
            PAUSE_LENGTH = 2#loop_length
            logging.info("Pause before jukebox: %.1fs" % PAUSE_LENGTH)
            program = Program(
                media_id=-1,
                program_start=clock.now(),
                playback_duration=1,#loop_length,
                title="Jukebox pause screen",
                filename=LOOP_FILENAME,
                loop=True)
            logging.debug("on_idle invoking cue_program({})".format(program))
            self.cue_program(program)
            self.programEndCallbackStack.append(self.play_ident)
            self.programEndCallbackStack.append(self.play_jukebox)
        elif time_until_next >= 12+IDENT_LENGTH:
            logging.info("Pause idle: %.1fs" % time_until_next)
            PAUSE_LENGTH = time_until_next
            program = Program(
                    media_id=-1,
                    program_start=clock.now(),
                    playback_duration=time_until_next-IDENT_LENGTH,
                    title="Pause screen",
                    filename='[HTML]" "https://frikanalen.no/graphics',
                    loop=True)
            logging.debug("on_idle invoking cue_program({})".format(program))
            self.cue_program(program)
            self.programEndCallbackStack.append(self.play_ident)
        else:
            logging.info("Short idle: %.1fs" % time_until_next)
            # Show pausescreen
            t = None
            if self.next_program:
                t = self.next_program.seconds_until_playback()
            program = Program(media_id=-1, program_start=clock.now(), playback_duration=t, title="Pause screen", filename=LOOP_FILENAME, loop=True)
            #self.cue_program(program) # TODO: Doesn't handle looping
            self.player.pause_screen()
            self.playing_program = program

def _get_class(cls):
    mod_path, cls_name = cls.split(':')
    module = importlib.import_module(mod_path)
    return getattr(module, cls_name)


if __name__ == '__main__':
    logging.addObserver(panic_on_unhandled_exception)
    start_test_player()
    reactor.run()
