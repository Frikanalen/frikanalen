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
            # Has this program started in the past?
            if program.program_start <= now:
                last = program
                # Is this program done?
                if program.playback_duration is None:
                    warning = """
                    get_current_program originally did not assume duration was not None.
                    Tore removed this check because it seemed superfluous.
                    This has turned out not to be the case for this program: """
                    logging.error(warning, program);
                if (program.seconds_since_scheduled_start() >= program.playback_duration):
                    last = None
            if last and program.program_start >= now:
                break
        logging.debug("get_current_program returned: ", program)
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
        logging.debug("get_next_program returned: ", program)
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

    def fetch_from_backend(self, date=None, days=7):
        "Testing in schedulestore"
        if not date:
            date = clock.now().date()
        logging.info("Fetching {} days of schedule from backend starting from {}".\
                format(days, date))
        programs = []

        for day in range(days):
            try:
                program_list = schedulestore.load(date+datetime.timedelta(days=day))
                for weirdLegacyDict in program_list:
                    programs.append(Program.fromWeirdLegacyDict(weirdLegacyDict))
            except Exception as e:
                raise

        if programs:
            self.programs = programs
        else:
            logging.warning("Schedule is empty!")

if __name__=="__main__":
    pass
    #s = Schedule()

    #v = Program()
    #delta = datetime.timedelta(0, 10) # 10 seconds
    #v.set_program(15, datetime.datetime.now() + delta)
    #assert(v.seconds_until_playback() > 9)
    #s.add(v)
    #print((s.get_next_program().media_id))
    #delta = datetime.timedelta(0, 5) # 5 seconds
    #v = Program()
    #v.set_program(16, datetime.datetime.now() + delta)
    #s.add(v)
    #print((s.get_next_program().media_id))
