from __future__ import unicode_literals

from django.db import models
from model_utils import Choices
from model_utils.models import TimeStampedModel

from fk.models import Video
from fk.models import VideoFile
from fk.models import FileFormat
from fk.models import User

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

class MediaUpload(TimeStampedModel):
    """
    Video Upload is a file being uploaded or awaiting processing.

    `filename` - The filename.

    `bytes` - The current size of the filename.

    `hash_sha256` - The current hash of the file.

    `last_write_at` - The time when it was last written to.

    `state` - The current state of the upload.
    """
    STATE = Choices('uploading', 'upload_maybe_complete', 'upload_complete', 'deleted')

    id = models.AutoField(primary_key=True)

    filename = models.CharField(max_length=512)
    size = models.IntegerField(default=0)
    #hash_md5 = models.IntegerField(blank=True, default=0)
    #hash_sha1 = models.IntegerField(blank=True, default=0)
    hash_sha256 = models.IntegerField(blank=True, default=0)
    uploader = models.ForeignKey(User, blank=True, null=True)

    last_write_at = models.DateTimeField(blank=True)

    state = models.CharField(max_length=256, choices=STATE, blank=True)
    nodename = models.CharField(max_length=256, blank=True, null=True)

    #complete = models.BooleanField(default=False) # Still being uploaded or not.
    #submitted_to_ingest = models.BooleanField(default=False) # Used to hide it from the upload list.
    target_video = models.ForeignKey(Video, blank=True, null=True) # When completed, submit as this video.
    #target_hash_md5 = models.IntegerField(blank=True, default=0)
    #target_hash_sha1 = models.IntegerField(blank=True, default=0)
    #target_hash_sha256 = models.IntegerField(blank=True, default=0)