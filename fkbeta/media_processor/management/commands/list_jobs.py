from django.core.management.base import BaseCommand, CommandError

from fk.models import Video
from optparse import make_option
from media_processor.models import Task

class Command(BaseCommand):
    args = '<video_id video_id ...>'
    help = 'List video jobs'

    def handle(self, *args, **options):
        for task in Task.objects.all():
            print task
