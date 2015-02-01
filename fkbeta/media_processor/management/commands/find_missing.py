# Examine the video database and check for any new jobs that might need to be added

from __future__ import unicode_literals

import logging
import sys

from django.core.management.base import BaseCommand

from fk.models import Video
from media_processor.models import Task


ORIGINAL_FORMATS = ('broadcast', 'original',)
DESIRED_FORMATS = ('large_thumb', 'theora',)


class Command(BaseCommand):
    help = 'Find missing file types and generate jobs to make them'
    log = logging.getLogger('find_missing')
    args = '[video_id ...]'

    log.addHandler(logging.StreamHandler(sys.stdout))
    log.setLevel(logging.DEBUG)

    def handle(self, *args, **options):
        if len(args):
            videos = []
            for video_id in args:
                videos.append(Video.objects.get(id=video_id))
        else:
            videos = Video.objects.all()

        for video in videos:
            originals = (
                video.videofile_set
                .filter(format__fsname__in=ORIGINAL_FORMATS))
            if not originals:
                self.log.info(
                    'Video %s has no original file, skipping...' % (video,))
                continue
            for wanted_format in DESIRED_FORMATS:
                desired_file = video.videofile_set.filter(
                    format__fsname=wanted_format)
                if desired_file:
                    self.log.debug(
                        'Video %s already has file in format %s'
                        % (video, wanted_format))
                    continue
                self.log.debug(
                    'Video %s lacks file in format %s; enqueueing...'
                    % (video, wanted_format))
                t = Task(source_file=originals[0],
                         target_format=wanted_format,
                         status=Task.STATE_PENDING)
                t.save()
