import logging
import datetime
from . import clock
import json
from . import lookup
from . import pgsched

# TODO: Need a Program that represents a generic program on disk w/o being scheduled
# TODO: Program that represents the following: jukebox, dead air, pause, program guide, ident

class Program(object):
    """
    program_start
        datetime
    media_id
        integer
    playback_offset
        None or float in seconds
    playback_duration
        None or float in seconds

    TODO: perhaps specify a "pase" media_id or somethign?
    """
    def __init__(self):
        self.media_id = None
        self.program_start = None
        self.playback_offset = None
        self.playback_duration = None
        self.title="N/A"
        self.data = {}
        self.loop = False

    def set_program(self, media_id, program_start=None, playback_offset=None, playback_duration=None, title="N/A", data={}, filename=None, loop=False):
        self.program_start = program_start
        self.media_id = media_id
        self.playback_offset = playback_offset
        self.playback_duration = playback_duration
        self.title = title
        self.data=data
        self.filename = filename
        self.loop = loop

    def get_filename(self):
        if self.filename:
            return self.filename
        else:
            return lookup.locate_media_by_id(self.media_id)

    def seconds_since_playback(self):
        dt = (clock.now() - self.program_start)
        return dt.seconds + dt.microseconds / 1e6

    def seconds_until_playback(self):
        dt = (self.program_start - clock.now())
        return dt.seconds + dt.microseconds / 1e6

    def seconds_until_end(self):
        duration = self.playback_duration
        if not duration:
            duration = self.get(duration)
        if not duration:
            raise Exception("No duration given for video %i" % self.media_id)
        dt = (self.program_start - clock.now())
        return dt.seconds + dt.microseconds / 1e6 + duration

    def __repr__(self):
        return "<Program #%i %r>" % (self.media_id, self.title)

    # Idiotic marshalling...
    def from_dict(self, d):
        # Tue Jul 19 12:30:00 2011
        fmt = "%a %b %d %H:%M:%S %Y"
        self.program_start = strptime(d["program_start"], fmt)
        self.media_id = d["media_id"]
        self.playback_offset = d["playback_offset"]
        self.playback_duration = d["playback_duration"]
        self.title = d["title"]

    def to_dict(self):
        end = None
        duration = self.playback_duration
        if duration == float("inf"):
            end = "inf"
            duration = "inf"
        elif duration:
            end = (self.program_start+datetime.timedelta(seconds=self.playback_duration)).isoformat()
        d = {
          "media_id": self.media_id,
          "program_start": self.program_start and self.program_start.isoformat(),
          "program_end": end,
          "playback_offset": self.playback_offset,
          "playback_duration": duration,
          "title": self.title
          }
        return d

    def json(self):
        d = self.to_dict()
        return json.dumps(d).encode('utf-8')

class Schedule(object):
    def __init__(self):
        self.programs = []

    def add(self, program):
        self.programs.append(program)

    def remove(self, program):
        self.programs.remove(program)

    def new_program(self):
        return Program()

    def get_current_program(self):
        now = clock.now()
        last = None
        for program in self.programs:
            if program.program_start <= now:
                # program already started
                last = program
                if program.playback_duration and (program.seconds_since_playback() >= program.playback_duration):
                    last = None
            if last and program.program_start >= now:
                break
        return last

    def get_next_program(self):
        now = clock.now()
        next = None
        for program in self.programs:
            if program.program_start <= now:
                # program already started
                continue
            if not next or next.program_start > program.program_start:
                # program is closer to now
                next = program
        return next

    def get_programs_by_date(self, date=None, as_dict=False):
        if not date:
            date = clock.now().date()
        l = []
        for program in self.programs:
            if program.program_start.date() == date:
                if as_dict:
                    l.append(program.to_dict())
                else:
                    l.append(program)
        return l

    def update_from_pg_cache(self, date=None, days=7):
        "Testing in pgsched"
        if not date:
            date = clock.now().date()
        programs = []
        day_loaded = []
        for day in range(days):
            l = pgsched.get_schedule_by_date(date+datetime.timedelta(days=day))
            this_date = date+datetime.timedelta(days=day)
            if not l:
                day_loaded.append((this_date, False))
                continue
            day_loaded.append((this_date, True))
            for d in l:
                program = self.new_program()
                program.set_program(
                    media_id=d["broadcast_location"],
                    program_start=d["starttime"],
                    playback_offset=0.0,
                    playback_duration=d["duration"] / 1000.,
                    title=d["name"],
                    # unused:
                    # endtime, video_id, header, schedule_reagion....
                    data=d
                    )
                programs.append(program)
        # Just print continously what days weren't loaded
        start = None
        last = None
        err = []
        while day_loaded:
            day, loaded = day_loaded.pop(0)
            if (not start) and (not loaded):
                # We have hit a first failure
                start = day
                last = day
            elif start and (not loaded):
                # The failure-streak lasts until today at least
                last = day
            if (start and loaded) or (not day_loaded and start):
                # But it ended today
                if start == last:
                    # It was a single day
                    err.append(str(start))
                else:
                    # It was a streak
                    err.append("%s - %s" % (str(start), str(last)))
        if err:
            logging.warning("Failed to update plans: %s" % ','.join(err))
        # Reconstruct playlist
        if programs:
            self.programs = []
            for program in programs:
                self.add(program)
        else:
            logging.warning("Cache empty")


if __name__=="__main__":
    s = Schedule()

    v = s.new_program()
    delta = datetime.timedelta(0, 10) # 10 seconds
    v.set_program(15, datetime.datetime.now() + delta)
    assert(v.seconds_until_playback() > 9)
    s.add(v)
    print((s.get_next_program().media_id))
    delta = datetime.timedelta(0, 5) # 5 seconds
    v = s.new_program()
    v.set_program(16, datetime.datetime.now() + delta)
    s.add(v)
    print((s.get_next_program().media_id))
