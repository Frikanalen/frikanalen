import json
from database import Schedule
from datetime import datetime

def playout_schedule():
    s = Schedule()
    video_list = s.get_date(datetime.now())
    return video_list

if __name__=='__main__':
    playout_schedule()
