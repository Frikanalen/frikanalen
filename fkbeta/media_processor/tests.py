"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.conf import settings

_TESTDB_NUM_VIDEOS = 2
_TESTDB_NUM_MISSING_FILES = 2
import logging, sys
from fk.models import Video, VideoFile
from models import Task
from queue import JobQueue

class SimpleTest(TestCase):
    log = logging.getLogger()
    log.addHandler(logging.StreamHandler(sys.stdout))
    log.level = logging.CRITICAL
    fixtures = ['test_data.json']
    
    def test_will_generate_jobs(self):
        from management.commands.find_missing import Command as find_missing 

        self.assertEqual(Task.objects.count(), 0)
        find_missing().handle()
        self.assertEqual(Task.objects.count(), _TESTDB_NUM_MISSING_FILES)

    # Twisted will not let us destroy the global reactor. Essentially
    # there does not seem to be any way to unit test twisted without
    # using their own special framework. Bah.
    def test_everything_about_encoder(self):
        from management.commands.run_queue import Command as run_queue
        random_videofile = VideoFile.objects.all()[0]

        for task in range(0,10):
            Task(source_file = random_videofile, target_format = 1337, status = Task.STATE_PENDING).save()

        run_queue().handle()

        for task in Task.objects.all():
            self.assertEqual(task.status, Task.STATE_COMPLETE)
