from itertools import tee
import json
from database import Schedule
from datetime import datetime
import pytz
import copy

from database.schedule import Graphics
def add_graphics(video_list):
    def pairwise(iterable):
        "s -> (s0,s1), (s1,s2), (s2, s3), ..."
        a, b = tee(iterable)
        next(b, None)
        return zip(a, b)

    graphics = []

    for v, w in pairwise(video_list['items']):
        g = Graphics()
        g.end_time = copy.deepcopy(w.start_time)
        g.start_time = copy.deepcopy(v.end_time)
        duration = int((g.end_time - g.start_time).total_seconds() * 1000)
        g.URL = f'https://frikanalen.no/graphics/?duration={duration}'
        graphics.append(g)

    video_list['items'] = sorted(video_list['items'] + graphics, key=lambda x: x.start_time)
    return video_list

def playout_schedule():
    s = Schedule()
    video_list = add_graphics(s.get_date(datetime.now(tz=pytz.timezone('Europe/Oslo'))))
    return video_list

if __name__=='__main__':
    print(playout_schedule())
