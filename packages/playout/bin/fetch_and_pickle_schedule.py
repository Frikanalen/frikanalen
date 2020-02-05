#!/usr/bin/env python
"""
Small tool to dump the schedule into intermediary pickles for the playout
"""
import collections
import math
import os
import pickle
import sys
from datetime import date, timedelta

import dateutil.parser
import pytz
import requests


def from_scheduleitem_to_playout(si):
    starttime = (dateutil.parser.parse(si['starttime'])
                 .astimezone(pytz.timezone("Europe/Oslo"))
                 .replace(tzinfo=None))
    # custom duration parser (to ms)
    duration = 1000 * sum(
        (60**n) * float(e)
        for (n, e) in enumerate(reversed(si['duration'].split(':'))))
    shorter = dict(
        broadcast_location=si['video']['id'],
        duration=math.ceil(duration),
        name=si['video']['name'],
        starttime=starttime,
    )
    return shorter


def get_schedule(from_day, days):
    # Need to go one day earlier, since server does days in UTC
    # (so we are missing the first happenings of the day)
    api_from_day = (from_day - timedelta(days=1)).strftime('%Y%m%d')
    req = requests.get('https://frikanalen.no/api/scheduleitems/' +
                       '?date=%s&days=%s&page_size=400&ordering=starttime' %
                       (api_from_day, days + 1))
    js = req.json()
    by_day = collections.defaultdict(list)
    last_day = (from_day + timedelta(days=days)).strftime('%Y%m%d')
    while True:
        for sched_item in js['results']:
            playout_item = from_scheduleitem_to_playout(sched_item)
            day = playout_item['starttime'].strftime('%Y%m%d')
            # Skip the UTC-hack day and the last day
            if day in (api_from_day, last_day):
                continue
            by_day[day].append(playout_item)
        if not js['next']:
            break
        js = requests.get(js['next']).json()
    return by_day


if __name__ == '__main__':
    try:
        days = int(sys.argv[1])
    except:
        print("USAGE: %s <days> [folder_to_store_pickles]" % sys.argv[0])
        print("")
        print("This script gets the Frikanalen schedule from API")
        print("and pickles each day (starting from today) to a folder.")
        sys.exit(1)
    folder = sys.argv[2] if len(sys.argv) == 3 else '.'
    from_day = date.today()
    schedule_by_day = get_schedule(from_day, days)
    for day, items in list(schedule_by_day.items()):
        fn = os.path.join(folder, 'plan%s.pickle' % day)
        with open(fn, 'wb') as fp:
            pickle.dump(items, fp)
