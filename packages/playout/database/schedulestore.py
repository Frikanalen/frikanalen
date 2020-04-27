import datetime
import pickle
import os
import requests
import logging
from dateutil.parser import isoparse

from twisted.enterprise import adbapi


from vision.configuration import configuration
from .video import Video

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

class ScheduledVideo():
    def __init__(self, video, startTime, endTime):
        self.video = video
        self.startTime = startTime
        self.endTime = endTime

    def asWeirdLegacyDict(self):
        """ The schedule uses this dict format so just as an intermediate
        step in cleaning up this code, this returns a dict with that format."""
        duration = _millisecond_duration_from_endpoints(self.startTime, self.endTime)
        video = {
                'broadcast_location': self.video.id,
                'duration': duration,
                'name': self.video.name,
                'starttime': self.startTime,
                }
        return video

    @classmethod
    def fromGraphNode(cls, node):
        entry = node['node']
        startTime = isoparse(entry['starttime']).astimezone(tz=None).replace(tzinfo=None)
        endTime = isoparse(entry['endtime']).astimezone(tz=None).replace(tzinfo=None)
        video = Video(entry['videoId'])
        video.name = entry['videoName']
        return cls(video, startTime, endTime)

def load(schedule_day):
    logging.info("Getting schedule for date {}".format(schedule_day.isoformat()))

    scheduleJSON = _fetch(schedule_day)

    returned_entries = scheduleJSON['data']['fkGetScheduleForDate']['edges']
    logging.info("Got {} entries.".format(len(returned_entries)))

    massaged_schedule = []

    for entrynode in returned_entries:
        scheduledVideo = ScheduledVideo.fromGraphNode(entrynode)
        massaged_schedule.append(scheduledVideo.asWeirdLegacyDict())

    return massaged_schedule

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
