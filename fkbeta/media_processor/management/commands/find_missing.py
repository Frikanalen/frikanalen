# Examine the video database and check for any new jobs that might need to be added

from __future__ import unicode_literals

import logging
import sys

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError

from fk.models import Video
from fk.models import FileFormat
from media_processor.models import Task


ORIGINAL_FORMATS = ('broadcast', 'original',)
DESIRED_FORMATS = ('large_thumb', 'theora',)


class Command(BaseCommand):
    help = "Find missing file types and generate jobs to make them"
    log = logging.getLogger('find_missing')
    args = '[video_id ...]'

    log.addHandler(logging.StreamHandler(sys.stdout))
    log.setLevel(logging.DEBUG)

    def handle(self, *args, **options):
        original_formats = (FileFormat.objects
                            .filter(fsname__in=ORIGINAL_FORMATS))
        desired_formats = (FileFormat.objects
                           .filter(fsname__in=DESIRED_FORMATS))
        if not original_formats or not desired_formats:
            msg = "Missing required file formats (in the database):"
            if not original_formats:
                msg += ("\n  Need at least one of %s as originals."
                        % str(ORIGINAL_FORMATS))
            if not desired_formats:
                msg += ("\n  Need at least one of %s as desired."
                        % str(DESIRED_FORMATS))
            raise CommandError(msg)
        if len(args):
            videos = []
            for video_id in args:
                videos.append(Video.objects.get(id=video_id))
        else:
            videos = Video.objects.all()

        for video in videos:
            originals = (
                video.videofile_set
                .filter(format__in=original_formats))
            if not originals:
                self.log.info(
                    "Video %s has no original file, skipping..." % (video,))
                continue
            for wanted_format in desired_formats:
                desired_file = video.videofile_set.filter(
                    format__fsname=wanted_format)
                if desired_file:
                    self.log.debug(
                        "Video %s already has file in format %s"
                        % (video, wanted_format))
                    continue
                self.log.debug(
                    "Video %s lacks file in format %s; enqueueing..."
                    % (video, wanted_format))
                t = Task(source_file=originals[0],
                         target_format=wanted_format,
                         status=Task.STATE_PENDING)
                t.save()
