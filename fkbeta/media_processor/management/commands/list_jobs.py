from django.core.management.base import BaseCommand

from media_processor.models import Task


class Command(BaseCommand):
    help = 'List video jobs'

    def handle(self, *args, **options):
        for task in Task.objects.all():
            print(task)
