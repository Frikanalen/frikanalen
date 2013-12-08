# Examine the video database and check for any new jobs that might need to be added

from django.core.management.base import BaseCommand, CommandError

from fk.models import Video
from media_processor.models import Task
from optparse import make_option

import logging

DESIRED_FORMATS = [1, 7]

class Command(BaseCommand):
    help = 'Find missing file types and generate jobs to make them'
    log = logging.getLogger('find_missing')

#    option_list = BaseCommand.option_list + (
#        make_option('--delete',
#            action='store_true',
#            dest='delete',
#            default=False,
#            help='Delete poll instead of closing it'),
#        )

    def handle(self, *args, **options):
        videos = Video.objects.all()
        
        for video in videos:
            try:
                original = video.videofile_set.filter(format_id = 6)[0]
            except IndexError:
                self.log.info('Video %s has no original file, skipping..' % (video,))
                continue
            for wanted_format_id in DESIRED_FORMATS:
                desired_file = video.videofile_set.filter(format_id = wanted_format_id)
                if len(desired_file):
                    self.log.debug('Video %s already has file in format %d' % (video, wanted_format_id))
                else:
                    self.log.debug('Video %s lacks file in format %d; enqueueing...' % (video, wanted_format_id))
                    t = Task(source_file = original, target_format = wanted_format_id, status=Task.STATE_PENDING)
                    t.save()
            
        #    self.stdout.write('Successfully closed poll "%s"' % poll_id)
