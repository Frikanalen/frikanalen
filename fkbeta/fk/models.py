# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_save

from colorful.fields import RGBColorField

from fk import fields

"""
Models for the Frikanalen database.

A lot of the models are business-specific for Frikanalen. There's also
a quite a few fields that are related to our legacy systems, but these
are likely to be removed when we're confident that data is properly transferred.

An empty database should populate at least FileFormat and Categories 
with some content before it can be properly used. 

Fields that are commented out are suggestions for future fields. If they turn 
out to be silly they should obviously be removed.
"""

SCHEDULE_REASONS = (
        (1, 'Legacy'),
        (2, 'Administrative'),
        (3, 'User'),
        )

class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    #uri_name = models.CharField(max_length=32) # Name to use in uri's, eg /org/frikanalen/
    description = models.TextField(blank=True, max_length=255)

    members = models.ManyToManyField(User) # User ownership of an organization
    fkmember = models.BooleanField(default=False)
    orgnr = models.CharField(blank=True, max_length=255)
    # owner = models.ForeignKey(User) # No such concept yet. Every member can add members.
    #featured_videos = models.ManyToManyField("Video") # Videos to feature on their frontpage, incl other members
    #twitter_username = models.CharField(null=True,max_length=255)
    #twitter_tags = models.CharField(null=True,max_length=255)
    #homepage = models.CharField(blank=True, max_length=255) # To be copied into every video they create
    #categories = models.ManyToManyField(Category)
    class Meta:
        db_table = u'Organization'
    def __unicode__(self):
        return self.name

class FileFormat(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField(unique=True, max_length=255,
           null=True, blank=True)
    fsname = models.CharField(max_length=20)
    #httpprefix = models.CharField(max_length=200)
    rgb = RGBColorField(default="cccccc")
    #mime_type = models.CharField(max_length=256)
    # metadata framerate, resolution, etc?
    class Meta:
        db_table = u'ItemType'
        verbose_name = u'video file format'
        verbose_name_plural = u'video file formats'
    def __unicode__(self):
        return self.fsname

class VideoFile(models.Model):
    id = models.AutoField(primary_key=True)
    #uploader = models.ForeignKey(User) # Not migrated
    video = models.ForeignKey("Video")
    format = models.ForeignKey("FileFormat")
    filename = models.CharField(max_length=256)
    old_filename = models.CharField(max_length=256)
    # source = video = models.ForeignKey("VideoFile")
    # created_time = models.DateTimeField()# encoded_time?
    # metadata frames, width, height, framerate? mlt profile name?
    # edl for in/out?
    def location(self):
        return '/'.join(('/mnt/media',
                str(self.video.id),
                self.format.fsname,
                self.filename))
    class Meta:
        verbose_name = u'video file'
        verbose_name_plural = u'video files'
    def __unicode__(self):
        return "%s version of %s" % (self.format.fsname, self.video.name)

class Category(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    rgb = RGBColorField()
    desc = models.CharField(max_length=255, blank=True)
    class Meta:
        db_table = u'Category'
        verbose_name = u'video category'
        verbose_name_plural = u'video categories'
    def __unicode__(self):
        return self.name

class VideoManager(models.Manager):
    def public(self):
        return super(VideoManager, self).get_query_set().filter(publish_on_web=True, proper_import=True)


class Video(models.Model):
    objects = VideoManager()
    id = models.AutoField(primary_key=True)
    header = models.TextField(blank=True, null=True, max_length=2048) # Retire, use description instead
    name = models.CharField(max_length=255)
    description = models.CharField(blank=True, null=True, max_length=2048)
    # production_code = models.CharField(null=True,max_length=255) # Code for editors' internal use
    categories = models.ManyToManyField(Category)
    editor = models.ForeignKey(User)
    has_tono_records = models.BooleanField()
    is_filler = models.BooleanField() # Find a better name?
    publish_on_web = models.BooleanField()
    #disabled = models.BooleanField() # Not migrated
    #uploader = models.ForeignKey(User)
    #planned_duration = models.IntegerField() # Planned duration in milliseconds, probably not going to be used
    #published_time = models.DateTimeField() # Time when it is to be published on web
    #created_time = models.DateTimeField() # Time the program record was created # Not migrated

    proper_import = models.BooleanField(default=False)
    played_count_web = models.IntegerField(default=0) # Number of times it has been played
    updated_time = models.DateTimeField(null=True) # Time the program record has been updated
    uploaded_time = models.DateTimeField(null=True) # Time the program record was created
    framerate = models.IntegerField(default=25000) # Framerate of master video in thousands / second
    organization = models.ForeignKey(Organization, null=True) # Organization for video
    ref_url = models.CharField(blank=True, max_length=1024) # URL for Reference
    duration = fields.MillisecondField() # in milliseconds
    #TODO: Tono-records
    class Meta:
        db_table = u'Video'
    def __unicode__(self):
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
        videofiles = VideoFile.objects.filter(video = self)
        return videofiles

    def category_list(self):
        categories = self.categories.filter(video = self)
        return categories

    def schedule(self):
        events = Scheduleitem.objects.filter(video = self)
        return events

    def first_broadcast(self):
        events = Scheduleitem.objects.filter(video = self)
        if events:
            return events[0]
        return None

    def last_broadcast(self):
        events = Scheduleitem.objects.filter(video = self)
        if events:
            return events[max(0, len(events)-1)]
        return None

    def videofile_url(self, fsname):
        format = FileFormat.objects.get(fsname=fsname)
        videofile = VideoFile.objects.get(video = self, format=format)
        return videofile.old_filename

    def small_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="small_thumb")
        try:
            videofile = VideoFile.objects.get(video = self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_small_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.old_filename

    def medium_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="medium_thumb")
        try:
            videofile = VideoFile.objects.get(video = self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_medium_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.old_filename

    def large_thumbnail_url(self):
        format = FileFormat.objects.get(fsname="large_thumb")
        try:
            videofile = VideoFile.objects.get(video = self, format=format)
        except ObjectDoesNotExist:
            return "/static/default_large_thumbnail.png"
        return settings.FK_MEDIA_URLPREFIX+videofile.old_filename

    def old_id(self):
        format = FileFormat.objects.get(fsname="broadcast")
        videofile = VideoFile.objects.get(video = self, format=format)
        return videofile.old_filename.split('/')[0]

    def ogv_url(self):
        url = settings.FK_MEDIA_URLPREFIX + self.videofile_url("theora")
        return url

    def mp4_url(self):
        url = settings.FK_MEDIA_URLPREFIX + self.videofile_url("mp4")
        return url



import datetime
from django.utils.timezone import utc

class ScheduleitemManager(models.Manager):
    def by_day(self, date=None, days=1, surrounding=False):
        if not date:
            date = datetime.datetime.utcnow().replace(tzinfo=utc).date()
        enddate = date + datetime.timedelta(days=days)
        if surrounding:
            # Try to find the event before the given date
            before = Scheduleitem.objects.filter(starttime__lte = date).order_by("-starttime")
            if before:
                date = before[0].starttime
            # Try to find the event after the end date
            after = Scheduleitem.objects.filter(starttime__gte = enddate).order_by("starttime")
            if after:
                enddate = after[0].starttime
        return super(ScheduleitemManager, self).get_query_set().filter(starttime__gte=date, starttime__lte=enddate)

class Scheduleitem(models.Model):
    objects = ScheduleitemManager()

    id = models.AutoField(primary_key=True)
    default_name = models.CharField(max_length=255, blank=True)
    video = models.ForeignKey(Video, null=True, blank=True)
    schedulereason = models.IntegerField(
            blank=True,
            choices = SCHEDULE_REASONS)
    starttime = models.DateTimeField()
    duration = fields.MillisecondField() # in milliseconds
    #endtime = models.DateTimeField() # Make this read only?

    """
    def save(self, *args, **kwargs):
        self.endtime = self.starttime + timeutils.duration
        super(Scheduleitem, self).save(*args, **kwargs)
    """
    class Meta:
        db_table = u'ScheduleItem'
        verbose_name = u'TX schedule entry'
        verbose_name_plural = u'TX schedule entries'

    def __unicode__(self):
        t = self.starttime
        s = t.strftime("%Y-%m-%d %H:%M:%S")
        s += ".%02i" % (t.microsecond / 10000) # format microsecond to hundreths
        if self.video:
            return str(s) + ": " + unicode(self.video)
        else:
            return str(s) + ": " + self.default_name

    def endtime(self):
        if not self.duration:
            return self.starttime
        return self.starttime + self.duration

class UserProfile(models.Model):
    # example from http://stackoverflow.com/questions/44109/extending-the-user-model-with-custom-fields-in-django
    user = models.OneToOneField(User)
    ssn = models.CharField(blank=True, max_length=255)
    phone_home = models.CharField(blank=True, max_length=255)
    phone_work = models.CharField(blank=True, max_length=255)
    phone_mobile = models.CharField(blank=True, max_length=255)
    home_address = models.CharField(blank=True, max_length=512)
    home_zip = models.CharField(blank=True, max_length=255)
    home_city = models.CharField(blank=True, max_length=255)
    home_country = models.CharField(blank=True, max_length=255)
    legacy_username = models.CharField(blank=True, max_length=255)

    def __str__(self):
          return "%s's profile" % self.user

def create_user_profile(sender, instance, created, **kwargs):
    if created:
       profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)

#class Scheduleregion(models.Model):
#    id = models.IntegerField(primary_key=True)
#    name = models.CharField(max_length=255)
#    rgb = RGBColorField()
#    starttime = models.TimeField()
#    endtime = models.TimeField()
#    class Meta:
#        db_table = u'ScheduleRegion'

#class Schedulereason(models.Model):
#    id = models.IntegerField(primary_key=True)
#    desc = models.CharField(max_length=255)
#    name = models.CharField(unique=True, max_length=255)
#    class Meta:
#        db_table = u'ScheduleReason'

#class Metadatatype(models.Model):
#    id = models.IntegerField(primary_key=True)
#    unit_short = models.CharField(max_length=255)
#    unit_long = models.CharField(max_length=255)
#    name = models.CharField(max_length=255)
#    desc_nor = models.CharField(max_length=255)
#    class Meta:
#        db_table = u'MetadataType'

#class Metadataattribute(models.Model):
#    id = models.IntegerField(primary_key=True)
#    name = models.CharField(max_length=255)
#    unit = models.ForeignKey(Metadatatype, db_column='unit')
#    displayname = models.CharField(max_length=255)
#    class Meta:
#        db_table = u'MetadataAttribute'
