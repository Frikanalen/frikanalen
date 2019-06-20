from django.core.management.base import BaseCommand

from agenda.views import fill_agenda_with_jukebox

class Command(BaseCommand):
    args = ''
    help = 'Automatically fill all available time with jukebox'

    def handle(self, *args, **options):
        if 1 < int(options['verbosity']):
            import logging
            logging.basicConfig(level=logging.INFO)
        fill_agenda_with_jukebox(days=2)
