import datetime
import pickle
import os
from dateutil.parser import isoparse

from twisted.python import log
from twisted.enterprise import adbapi

import requests

from vision.configuration import configuration

# For compatibility reasons, just grafting on the data format
# the scheduler expects to find in the code according to the 
# old pickle data format
def _millisecond_duration_from_endpoints(starttime, endtime):
    duration = int(((endtime - starttime).seconds * 1000) +\
            ((endtime - starttime).microseconds / 1000))
    return duration
              
def get_schedule_by_date(date):
    query = '''query {
          fkGetScheduleForDate(fromDate: "%s") {
            edges {
              node {
                scheduleitemId
                videoId
                organizationId
                starttime
                endtime
                videoName
                organizationName
              }
            }
          }
          }''' % (date.isoformat(),)
    request = requests.post(configuration.graphql_endpoint, json={'query':query})
    result = request.json()
    returned_entries = result['data']['fkGetScheduleForDate']['edges']

    massaged_schedule = []
    for entrynode in returned_entries:
        entry = entrynode['node']
        startTime = isoparse(entry['starttime']).replace(tzinfo = None)
        endTime = isoparse(entry['endtime']).replace(tzinfo = None)
        duration = _millisecond_duration_from_endpoints(startTime, endTime)
        video = {
                'broadcast_location': entry['videoId'],
                'duration': duration,
                'name': entry['videoName'],
                'starttime': startTime,
                }
        massaged_schedule.append(video)

    return massaged_schedule

if __name__=="__main__":
    from twisted.internet import reactor
    import pprint
    date = datetime.date.today()
    #date = datetime.date(year=2011, month=1, day=1)
    cache_schedule(date, 14)\
            .addCallback(lambda x: pprint.pprint(get_schedule_by_date(date)[0]))\
            .addCallback(lambda x: reactor.stop())
    reactor.run()
    #print date_to_cache_filename(datetime.date.today())
