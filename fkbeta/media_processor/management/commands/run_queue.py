# Run any pending tasks before returning

from __future__ import unicode_literals

import logging

from django.core.management.base import BaseCommand
from twisted.internet import reactor

from media_processor.models import Task
from media_processor.workers import WorkerFactory


class Command(BaseCommand):
    help = "Run all tasks in the 'PENDING' state before returning"
    log = logging.getLogger('run_queue')
    outstanding_jobs = 0

    def run_task(self, task):
        worker = WorkerFactory().get_worker_from_task(task)
        self.outstanding_jobs += 1
        d = worker.go()
        d.addCallbacks(self.done,self.done)

    def done(self, task):
        self.outstanding_jobs -= 1
        if not self.outstanding_jobs:
            reactor.stop()

    def handle(self, *args, **options):
        pending_tasks = Task.objects.filter(status=Task.STATE_PENDING)
        self.log.info("%d outstanding tasks" % (len(pending_tasks),))
        if pending_tasks:
            for task in pending_tasks:
                self.run_task(task)
            reactor.run()
