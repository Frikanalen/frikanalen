

from django.db import models

from fk.models import VideoFile
from fk.models import FileFormat


class Task(models.Model):
    STATE_NOTSET = 0
    STATE_PENDING = 1
    STATE_RUNNING = 2
    STATE_COMPLETE = 3
    STATE_FAILED = 4

    STATES = (
        (STATE_NOTSET, "Not set"),
        (STATE_PENDING, "Pending"),
        (STATE_RUNNING, "Running"),
        (STATE_COMPLETE, "Complete"),
        (STATE_FAILED, "Failed"),
    )

    source_file = models.ForeignKey(VideoFile)
    target_format = models.ForeignKey(FileFormat)

    parameters = models.CharField(blank=True, default='', max_length=4096)
    result = models.CharField(blank=True, default='', max_length=4096)
    status = models.IntegerField(
            default=STATE_NOTSET,
            choices=STATES)

    def __unicode__(self):
        return ("{status} task to get "
                "{s.target_format} from {s.source_file}"
                .format(s=self, status=self.get_status_display()))
