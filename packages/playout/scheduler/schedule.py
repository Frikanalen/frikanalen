import logging
import datetime
from . import clock
import json
from database import schedulestore, video
from .program import Program


class Schedule(object):
    def __init__(self):
        self.programs = []

    def add(self, program):
        self.programs.append(program)

    def remove(self, program):
        self.programs.remove(program)

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
        "Testing in schedulestore"
        if not date:
            date = clock.now().date()
        programs = []
        day_loaded = []
        for day in range(days):
            l = schedulestore.get_schedule_by_date(date+datetime.timedelta(days=day))
            this_date = date+datetime.timedelta(days=day)
            if not l:
                day_loaded.append((this_date, False))
                continue
            day_loaded.append((this_date, True))
            for d in l:
                program = Program()
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

    v = Program()
    delta = datetime.timedelta(0, 10) # 10 seconds
    v.set_program(15, datetime.datetime.now() + delta)
    assert(v.seconds_until_playback() > 9)
    s.add(v)
    print((s.get_next_program().media_id))
    delta = datetime.timedelta(0, 5) # 5 seconds
    v = Program()
    v.set_program(16, datetime.datetime.now() + delta)
    s.add(v)
    print((s.get_next_program().media_id))
