#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import csv
import random
import logging
from .configuration import configuration
def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.reader(utf_8_decoder(unicode_csv_data),
                            dialect=dialect, **kwargs)
    for row in csv_reader:
        # decode UTF-8 back to Unicode, cell by cell:
        yield [str(cell, 'utf-8') for cell in row]

def utf_8_decoder(unicode_csv_data):
    for line in unicode_csv_data:
        yield line.decode('utf-8')

"""
SELECT id, name, has_tono_records, video_id, type_id, version, creation_began, creation_finished,
"VideoItem".offset, duration, location
FROM "Video"
JOIN "VideoItem" ON "VideoItem".video_id = "Video".id
AND "VideoItem".type_id = 2;
"""

class RandomProvider(object):
    headroom = 45 # seconds
    minimum_duration = 30 # seconds
    def __init__(self, filename=os.path.join('cache', 'csvdb', 'jukebox_selection.csv')):
        self.filename = filename
        self.reload()

    def reload(self):
        videos = csv.reader(open(self.filename, "r"), delimiter='|')
        l = []
        columns = []
        shortest_duration = None
        for row in videos:
            if not columns:
                columns = row
                continue
            d = {}
            for name, field in zip(columns, row):
                if name == "name":
                    field = field
                elif name == "duration":
                    field = float(field)
                elif name == "location":
                    continue
                    # TODO: There are more formats to "location" in the legacy DB videotable, so this will fail! Investigate.
                    #s = field[36:]
                    #s = s[:s.find('/')]
                    #field = int(s)
                    #name = "media_id"
                elif name == "id":
                    name = "media_id"
                    field = int(field)
                d[name] = field
            if d["duration"] < self.minimum_duration:
                continue
            if not shortest_duration or d["duration"] < shortest_duration:
                shortest_duration = d["duration"]
            l.append(d)
        if not l:
            logging.warning("No videos in in jukebox")
        else:
            logging.info("Total %i videos in jukebox. Shortest duration is %.1fs" % (len(l), shortest_duration))
        self.videos = l
        self.shortest_duration = shortest_duration

    def get_random_video(self, length):
        # TODO: Create a full playlist program from it
        result = self.get_random_videos(length, max=1)
        if not result:
            return None
        else:
            return result[0]

    def enough_room(self, limit):
        """Test if we have any movies within a given timelimit + headroom."""
        if not self.videos:
            return False
        return self.shortest_duration + self.headroom < limit

    def get_random_videos(self, length, max=None):
        """Get random videos from the jukebox selection to fill up 'length' seconds"""
        filled_length = 0.0
        done = False
        videos = []
        deadlock_limit = 1000 # max 1000 attempts
        deadlock_count = 0
        while not done:
            if deadlock_count > deadlock_limit:
                logging.critical("Deadlock count reached! Jukebox algo is broken.")
                # TODO: Trivia, when this happens it will actually just Tuba. That is, not do anything until next video starts
                return []
            deadlock_count += 1
            # Do we have enough videos?
            if max and len(videos) == max:
                done = True
            # Is there time enough to insert a video?
            elif length - filled_length > self.headroom:
                video = random.choice(self.videos)
                if video["duration"] < self.minimum_duration: # Aestethic reasons. The pause is ~39 seconds, so this looks less silly
                    continue
                if video["duration"] > (length-filled_length-self.headroom):
                    continue
                if video["has_tono_records"] == "t":
                    continue
                if video in videos:
                    continue
                # Video found. Add!
                filled_length += video["duration"]
                videos.append(video)
            else:
                done = True
        return videos


if __name__=="__main__":
    import pprint
    random_provider = RandomProvider()
    pprint.pprint(random_provider.get_random_video(120))
