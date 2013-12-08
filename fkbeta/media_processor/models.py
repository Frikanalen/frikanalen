from django.db import models
from fk.models import VideoFile

class Task(models.Model):
    STATE_NOTSET = 0
    STATE_PENDING = 1
    STATE_RUNNING = 2
    STATE_COMPLETE = 3

    STATES = (
            (0, 'Not set'),
            (1, 'Pending'),
            (2, 'Running'),
            (3, 'Complete'),
            )

    source_file = models.ForeignKey(VideoFile)
    target_format = models.IntegerField()
    parameters = models.CharField(blank=True, max_length=4096)
    result = models.CharField(blank=True, max_length=4096)
    status = models.IntegerField(
            default=0,
            choices=STATES)

    def __unicode__(self):
        return '%s task to get %s from %s' % (self.get_status_display(), self.target_format, self.source_file)


