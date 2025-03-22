from fk.models import Scheduleitem
from fk.models import Category
from fk.models import FileFormat
from fk.models import Organization
from fk.models import VideoFile
from fk.models import VideoManager


from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import models


import datetime
import uuid


class Video(models.Model):
    id = models.AutoField(primary_key=True)
    # Retire, use description instead
    header = models.TextField(blank=True, null=True, max_length=2048)
    name = models.CharField(max_length=255)
    description = models.CharField(blank=True, null=True, max_length=2048)
    # Code for editors' internal use
    # production_code = models.CharField(null=True,max_length=255)
    categories = models.ManyToManyField(Category)
    creator = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    has_tono_records = models.BooleanField(default=False)
    is_filler = models.BooleanField('Play automatically?',
                                    help_text='You still have the editorial responsibility.  Only affect videos from members.',
                                    default=False)  # Find a better name?
    publish_on_web = models.BooleanField(default=True)

    # disabled = models.BooleanField() # Not migrated
    # uploader = models.ForeignKey(settings.AUTH_USER_MODEL)
    # Planned duration in milliseconds, probably not going to be used
    # planned_duration = models.IntegerField()
    # Time when it is to be published on web
    # published_time = models.DateTimeField()

    proper_import = models.BooleanField(default=False)
    played_count_web = models.IntegerField(
        default=0, help_text='Number of times it has been played')
    created_time = models.DateTimeField(
        auto_now_add=True, null=True,
        help_text='Time the program record was created')
    updated_time = models.DateTimeField(
        auto_now=True, null=True,
        help_text='Time the program record has been updated')
    uploaded_time = models.DateTimeField(
        blank=True, null=True,
        help_text='Time the original video for the program was uploaded')
    framerate = models.IntegerField(
        default=25000,
        help_text='Framerate of master video in thousands / second')
    organization = models.ForeignKey(
        Organization, null=True, help_text='Organization for video',
        on_delete=models.PROTECT)
    ref_url = models.CharField(
        blank=True, max_length=1024, help_text='URL for reference')
    duration = models.DurationField(blank=True, default=datetime.timedelta(0))

    # This field is used by the new ingest.
    media_metadata = models.JSONField(blank=True, default=dict)

    # This function is a workaround so we can pass a callable
    # to default argument. Otherwise, the migration analyser evaluates
    # the UUID and then concludes a new default value has been assigned,
    # helpfully generating a migration.
    #
    # upload_token should be migrated to a UUIDField, and that transition
    # needs to be tested throughout the upload chain.
    # upload_token = models.UUIDField(blank=True, default=uuid.uuid4,
    #                 editable=False,
    #                 help_text='Video upload token (used by fkupload/frontend)')

    @staticmethod
    def default_uuid_value():
        return uuid.uuid4().hex

    upload_token = models.CharField(blank=True, default=default_uuid_value.__func__,
                                    max_length=32, help_text='Video upload token (used by fkupload/frontend)')

    objects = VideoManager()

    class Meta:
        get_latest_by = 'uploaded_time'
        ordering = ('-id',)

    def __str__(self):
        return self.name

    def is_public(self):
        return self.publish_on_web and self.proper_import

    def tags(self):
        tags = []
        if self.has_tono_records:
            tags.append("tono")
        if self.publish_on_web:
            tags.append("www")
        if self.is_filler:
            tags.append("filler")
        return ', '.join(tags)

    def videofiles(self):
        videofiles = VideoFile.objects.filter(video=self)
        return videofiles

    def category_list(self):
        categories = self.categories.filter(video=self)
        return categories

    def schedule(self):
        events = Scheduleitem.objects.filter(video=self)
        return events

    def first_broadcast(self):
        events = Scheduleitem.objects.filter(video=self)
        if events:
            return events[0]
        return None

    def last_broadcast(self):
        events = Scheduleitem.objects.filter(video=self)
        if events:
            return events[max(0, len(events)-1)]
        return None

    def videofile_url(self, fsname):
        videofile = self.videofile_set.get(format__fsname=fsname)
        return videofile.location(relative=True)

    def small_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="small_thumb")
        try:
            videofile = VideoFile.objects.get(video=self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_small_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.location(relative=True)

    def medium_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="medium_thumb")
        try:
            videofile = VideoFile.objects.get(video=self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_medium_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.location(relative=True)

    def large_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="large_thumb")
        try:
            videofile = VideoFile.objects.get(video=self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_large_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.location(relative=True)

    def ogv_url(self):
        try:
            return settings.FK_MEDIA_URLPREFIX + self.videofile_url("theora")
        except ObjectDoesNotExist:
            return

    def vod_files(self):
        """Return a list of video files fit for the video on demand
        presentation, with associated MIME type.

        [
          {
            'url: 'https://../.../file.ogv',
            'mime_type': 'video/ogg',
          },
        ]

        """

        vodfiles = []
        for videofile in self.videofiles().filter(format__vod_publish=True):
            url = settings.FK_MEDIA_URLPREFIX + \
                videofile.location(relative=True)
            vodfiles.append(
                {'url': url, 'mime_type': videofile.format.mime_type})
        return vodfiles

    def get_absolute_url(self):
        return f'/video/{self.id}/'
