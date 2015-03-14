import logging

from django.test import TestCase

from fk.models import VideoFile
from fk.models import FileFormat
from media_processor.models import Task


logging.disable(logging.INFO)

class SimpleTest(TestCase):
    fixtures = ['test_data.json']

    def test_will_generate_jobs(self):
        from management.commands.find_missing import Command as find_missing

        self.assertEqual(Task.objects.count(), 0)
        find_missing().handle()
        self.assertEqual(Task.objects.count(), 2 * 2)

    # Twisted will not let us destroy the global reactor. Essentially
    # there does not seem to be any way to unit test twisted without
    # using their own special framework. Bah.
    def test_everything_about_encoder(self):
        from management.commands.run_queue import Command as run_queue
        random_videofile = VideoFile.objects.all()[0]
        wait = FileFormat.objects.create(fsname='waitasecond')

        for task in range(0, 3):
            Task(source_file=random_videofile,
                 target_format=wait,
                 status=Task.STATE_PENDING).save()

        run_queue().handle()

        for task in Task.objects.all():
            self.assertEqual(task.status, Task.STATE_COMPLETE)
