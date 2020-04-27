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

    def candidate_get_current_program(self):
        now = clock.now()
        # Create a list of programs sorted by start time
        p_by_startTime = sorted(self.programs, key=lambda p: p.program_start)

        try:
            running_program = [p for p in p_by_startTime \
                    if p.program_start <= now and p.endTime() >= now][0]
            return running_program
        except IndexError:
            return None

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
                    Tore wants to remove this check because it seemed superfluous.
                    This has turned out not to be the case for this program: """
                    logging.error(warning, program);
                    last = None
                else:
                    if program.seconds_since_scheduled_start() >= program.playback_duration:
                        last = None
            if last and program.program_start >= now:
                break

        ## Testing new code in production, woot
        try:
            expected_identical = self.candidate_get_current_program()
            if expected_identical != last:
                format_str = """candidate_get_current_program() returned differing
                output from the old get_current_program(). Returning the value from the
                old one. \nold = {}\nnew = {}"""
                logging.error(format_str.format(last, expected_identical))
            else:
                logging.info("""candidate_get_current_program() worked""")
        except Exception as e:
            logging.error("got exception {} calling candidate_get_current_program() (old returned {})"\
                    .format(e, last))
            pass

        logging.debug("get_current_program returned: {}".format(program))
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

        logging.debug("get_next_program returned: {}".format(program))

        ## Testing new code in production, woot
        try:
            expected_identical = self.candidate_get_next_program()
            if expected_identical != next:
                format_str = """candidate_get_next_program() returned differing
                output from the old get_next_program(). Returning the value from the
                old one. \nold = {}\nnew = {}"""
                logging.error(format_str.format(next, expected_identical))
            else:
                logging.info("""candidate_get_next_program() worked""")
        except Exception as e:
            logging.error("got exception {} calling candidate_get_next_program() (old returned {})"\
                    .format(e, next))
            pass

        return next

    def candidate_get_next_program(self):
        now = clock.now()

        # Create a list of programs sorted by start time
        p_by_startTime = sorted(self.programs, key=lambda p: p.program_start)

        # Eliminate all programs in the past; the first item on the list is the next program
        # if the list is empty, it will raise IndexError so we return None
        try:
            next_program = [p for p in p_by_startTime if not p.program_start < clock.now()][0]
        except IndexError:
            return None

        return next_program

    def fetch_from_backend(self, date=None, days=7):
        "Testing in schedulestore"
        if not date:
            date = clock.now().date()

        logging.info("Fetching {} days of schedule from backend starting from {}".\
                format(days, date))

        programs = []

        try:
            program_list = schedulestore.load(date, days)
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
    s = Schedule()
    s.fetch_from_backend(days=2)
    print("current: ", s.get_current_program())
    print("next: ", s.get_next_program())

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
