from django.core.management.base import BaseCommand

from agenda.views import fill_next_weeks_agenda

class Command(BaseCommand):
    args = ''
    help = 'Automatically create schedule for the next week'

    def handle(self, *args, **options):
        if 1 < int(options['verbosity']):
            import logging
            logging.basicConfig(level=logging.INFO)
        fill_next_weeks_agenda()
