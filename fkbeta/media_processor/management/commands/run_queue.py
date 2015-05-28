# Run any pending tasks before returning

from __future__ import unicode_literals

import logging
# I have to do this or the logger in media_processor.workers 
# complains about 'No handlers could be found for logger "media_processor.workers"'
logging.basicConfig() 

from django.core.management.base import BaseCommand
from twisted.internet import reactor

from media_processor.models import Task
from media_processor.workers import WorkerFactory
from optparse import make_option

class Command(BaseCommand):
    help = "Run all tasks in the 'PENDING' state before returning"
    logger = logging.getLogger(__name__)
    outstanding_jobs = 0

    def run_task(self, task):
        worker = WorkerFactory().get_worker_from_task(task)
        self.outstanding_jobs += 1
        d = worker.go()
        d.addCallbacks(self.done, self.done)

    def done(self, task):
        self.outstanding_jobs -= 1
        if not self.outstanding_jobs and reactor.running:
            reactor.stop()

    def handle(self, *args, **options):
        pending_tasks = Task.objects.filter(status=Task.STATE_PENDING)
        if options["retry"]:
            pending_tasks |= Task.objects.filter(status=Task.STATE_FAILED)
        self.logger.info("%d outstanding tasks" % (len(pending_tasks),))
        if pending_tasks:
            for task in pending_tasks:
                self.run_task(task)
            if self.outstanding_jobs > 0:
                reactor.run()

    # Django <=1.7
    option_list = BaseCommand.option_list + (
        make_option('--retry', '-r',
        action='store_true',
        dest='retry',
        default=False,
        help='Retry failed jobs'),
        )

    # Django 1.8
    def add_arguments(self, parser):
        raise NotImplemented, "Django 1.8 not tested. Probably need to remove the legacy code above."
        parser.add_argument('--retry', '-r',
            action='store_true',
            dest='retry',
            default=False,
            help='Retry failed jobs')