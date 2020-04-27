import datetime
import pickle
import os
import requests
import logging

from twisted.enterprise import adbapi

from vision.configuration import configuration
from .video import Video

from scheduler.program import ScheduledVideo
from scheduler import schedule

# For compatibility reasons, just grafting on the data format
# the scheduler expects to find in the code according to the
# old pickle data format
def _millisecond_duration_from_endpoints(starttime, endtime):
    duration = int(((endtime - starttime).seconds * 1000) +\
            ((endtime - starttime).microseconds / 1000))
    return duration

def _fetch(date):
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
    request = requests.post(configuration.graphqlEndpoint, json={'query':query})
    return request.json()

def load(startDate, numDays = 1):
    logging.info("Getting {} days of schedule starting at date {}".format(numDays, startDate.isoformat()))

    newSchedule = schedule.Schedule()

    for offsetDay in range(numDays):
        schedule_day = startDate + datetime.timedelta(days=offsetDay)

        scheduleJSON = _fetch(schedule_day)
        returned_entries = scheduleJSON['data']['fkGetScheduleForDate']['edges']
        logging.info("Got {} entries.".format(len(returned_entries)))

        for entrynode in returned_entries:
            newSchedule.programs.append(ScheduledVideo.fromGraphNode(entrynode))

    return newSchedule

if __name__=="__main__":
    pass
    #print(load(datetime.datetime.now()))
    #from twisted.internet import reactor
    #import pprint
    #date = datetime.date.today()
    ##date = datetime.date(year=2011, month=1, day=1)
    #cache_schedule(date, 14)\
    #        .addCallback(lambda x: pprint.pprint(load(date)[0]))\
    #        .addCallback(lambda x: reactor.stop())
    #reactor.run()
    #print date_to_cache_filename(datetime.date.today())
