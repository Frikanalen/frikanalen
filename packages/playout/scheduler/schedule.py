import logging
import datetime
from . import clock
import json
from database import video
from .program import Program

class Schedule():
    def __init__(self):
        self.programs = []

    def get_current_program(self):
        now = clock.now()
        # Create a list of programs sorted by start time
        p_by_startTime = sorted(self.programs, key=lambda p: p.program_start)

        # Eliminate all programs not overlapping with current time.
        try:
            running_program = [p for p in p_by_startTime \
                    if p.program_start <= now and p.endTime() >= now][0]
        except IndexError:
            return None

        logging.debug("get_current_program returned: {}".format(running_program))
        return running_program

    def get_next_program(self):
        now = clock.now()

        # Create a list of programs sorted by start time
        p_by_startTime = sorted(self.programs, key=lambda p: p.program_start)

        # Eliminate all programs in the past; the first item on the list is the next program
        # If all programs are in the past, it will raise IndexError so we return None
        try:
            next_program = [p for p in p_by_startTime if not p.program_start < clock.now()][0]
        except IndexError:
            return None

        logging.debug("get_next_program returned: {}".format(next_program))
        return next_program

if __name__=="__main__":
    pass
    s = Schedule()
    s.fetch_from_backend(days=2)
    print("current: ", s.get_current_program())
    print("next: ", s.get_next_program())
