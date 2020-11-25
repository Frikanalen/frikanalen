import psycopg2
from datetime import datetime, timedelta

class Gap():
    def __init__(self, start_time, end_time):
        self.start_time = start_time
        self.end_time = end_time

    @property
    def duration(self):
        return self.end_time - self.start_time

    def __repr__(self):
        return f"Gap from {self.start_time} to {self.end_time}"

def get_gaps(start_time, end_time):
    conn = psycopg2.connect("dbname=fkweb password=temporary host=10.244.2.228 user=fkschedule")
    cur = conn.cursor()

    min_gap_duration = timedelta(minutes=5)
    cur.execute(
            "select gap_start_time, gap_end_time from fk_schedule_gaps(%s, %s) where gap_duration >= %s",
            (start_time, end_time, min_gap_duration)
            )
    return [Gap(*row) for row in cur.fetchall()]

def random_video():
    query = "select * from fk_video where is_filler=True order by random() limit 1;"

def fill_gap(gap):
    new_gap = gap
    #new_gap.start_time += time_consumed

def split_gaps(gap_list):
    return gap_list
    # TODO: Split gaps into 30-minute boundrary units
    for gap in gap_list:
        if gap.duration >= timedelta(minutes=30):
            pass

def fill_today():
    start_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_time = start_time + timedelta(days=1, microseconds=-1)

    gaps = get_gaps(start_time, end_time)
    print(gaps)
    gaps = split_gaps(gaps)

    for gap in gaps:
        fill_gap(gap)

if __name__=='__main__':
    print(fill_today())
