# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import datetime
import logging
import os
import uuid
from zoneinfo import ZoneInfo

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.cache import caches
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext as _
from model_utils import Choices
from model_utils.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField

logger = logging.getLogger(__name__)


"""
Models for the Frikanalen database.

A lot of the models are business-specific for Frikanalen. There's also a
quite a few fields that are related to our legacy systems, but these are
likely to be removed when we're confident that data is properly
transferred.

An empty database should populate at least FileFormat and Categories with
some content before it can be properly used.

Fields that are commented out are suggestions for future fields. If they
turn out to be silly they should obviously be removed.
"""


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, date_of_birth, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, date_of_birth, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address', max_length=254, unique=True)
    first_name = models.CharField(
        blank=True, max_length=30, verbose_name='first name')
    last_name = models.CharField(
        blank=True, max_length=30, verbose_name='last name')
    is_active = models.BooleanField(
        default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')
    is_superuser = models.BooleanField(
        default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='admin status')
    identity_confirmed = models.BooleanField(
        default=False, help_text='Whether the identity of this user has been confirmed by Frikanalen management.', verbose_name='identity confirmed')

    phone_number = PhoneNumberField(
        blank=True, help_text='Phone number at which this user can be reached', verbose_name='phone number')

    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    date_of_birth = models.DateField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['date_of_birth']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_superuser

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return self.is_superuser

    def get_short_name(self):
        return self.email

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, max_length=255)

    # User ownership of an organization
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    fkmember = models.BooleanField(default=False)
    orgnr = models.CharField(blank=True, max_length=255)
    homepage = models.CharField('Link back to the organisation home page.',
                                blank=True, null=True, max_length=255)

    postal_address = models.TextField('Postal address for organization.',
                                      blank=True, null=True, max_length=2048)
    street_address = models.TextField('Street address for organization.',
                                      blank=True, null=True, max_length=2048)

    # The user legally marked as the editor for this organization
    editor = models.ForeignKey(User, on_delete=models.SET_NULL,
                               blank=True, null=True, related_name='editor')

    # Videos to feature on their frontpage, incl other members
    # featured_videos = models.ManyToManyField("Video")
    # twitter_email = models.CharField(null=True,max_length=255)
    # twitter_tags = models.CharField(null=True,max_length=255)
    # To be copied into every video they create
    # categories = models.ManyToManyField(Category)

    class Meta:
        ordering = ('name', '-id')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('vod-org-video-list', kwargs={'orgid': self.id})


class FileFormat(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField(
        unique=True, max_length=255, null=True, blank=True)
    fsname = models.CharField(max_length=20)
    vod_publish = models.BooleanField('Present video format to video on demand?',
                                      default=False)
    mime_type = models.CharField(max_length=256,
                                 null=True, blank=True)

    # httpprefix = models.CharField(max_length=200)
    # metadata framerate, resolution, etc?

    class Meta:
        verbose_name = 'video file format'
        verbose_name_plural = 'video file formats'
        ordering = ('fsname', '-id')

    def __str__(self):
        return self.fsname


class VideoFile(models.Model):
    id = models.AutoField(primary_key=True)
    # uploader = models.ForeignKey(User) # Not migrated
    video = models.ForeignKey("Video", on_delete=models.CASCADE)
    format = models.ForeignKey("FileFormat", on_delete=models.PROTECT)
    filename = models.CharField(max_length=256)
    # source = video = models.ForeignKey("VideoFile")
    integrated_lufs = models.FloatField(
        'Integrated LUFS of file defined in ITU R.128',
        blank=True, null=True)
    truepeak_lufs = models.FloatField(
        'True peak LUFS of file defined in ITU R.128',
        blank=True, null=True)
    created_time = models.DateTimeField(
        auto_now_add=True, null=True,
        help_text='Time the video file was created')
    # metadata frames, width, height, framerate? mlt profile name?
    # edl for in/out?

    class Meta:
        verbose_name = 'video file'
        verbose_name_plural = 'video files'
        ordering = ('-video_id', '-id',)

    def __str__(self):
        return "%s version of %s" % (self.format.fsname, self.video.name)

    def location(self, relative=False):
        filename = os.path.basename(self.filename)

        path = '/'.join((str(self.video.id), self.format.fsname, filename))

        if relative:
            return path
        else:
            return '/'.join((settings.FK_MEDIA_ROOT, path))


class Category(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'video category'
        verbose_name_plural = 'video categories'
        ordering = ('name', '-id')

    def __str__(self):
        return self.name


class VideoManager(models.Manager):
    def public(self):
        return (super(VideoManager, self)
                .get_queryset()
                .filter(publish_on_web=True, proper_import=True))

    def fillers(self):
        return (super(VideoManager, self)
                .get_queryset()
                .filter(is_filler=True, has_tono_records=False,
                        organization__fkmember=True, proper_import=True))


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


class ScheduleitemManager(models.Manager):
    def by_day(self, date=None, days=1, surrounding=False):
        if not date:
            date = timezone.now().astimezone(ZoneInfo('Europe/Oslo')).date()
        elif hasattr(date, 'date'):
            date.replace(tzinfo=timezone.get_current_timezone())
            date = date.date()
        startdt = datetime.datetime.combine(
            date, datetime.time(0, tzinfo=ZoneInfo('Europe/Oslo')))
        enddt = startdt + datetime.timedelta(days=days)
        if surrounding:
            startdt, enddt = self.expand_to_surrounding(startdt, enddt)
        return self.get_queryset().filter(starttime__gte=startdt,
                                          starttime__lte=enddt)

    def expand_to_surrounding(self, startdt, enddt):
        # Try to find the event before the given date
        try:
            startdt = (Scheduleitem.objects
                       .filter(starttime__lte=startdt)
                       .order_by("-starttime")[0].starttime)
        except IndexError:
            pass
        # Try to find the event after the end date
        try:
            enddt = (Scheduleitem.objects
                     .filter(starttime__gte=enddt)
                     .order_by("starttime")[0].starttime)
        except IndexError:
            pass
        return startdt, enddt


class Scheduleitem(models.Model):
    REASON_LEGACY = 1
    REASON_ADMIN = 2
    REASON_USER = 3
    REASON_AUTO = 4
    REASON_JUKEBOX = 5
    SCHEDULE_REASONS = (
        (REASON_LEGACY, 'Legacy'),
        (REASON_ADMIN, 'Administrative'),
        (REASON_USER, 'User'),
        (REASON_AUTO, 'Automatic'),
        (REASON_JUKEBOX, 'Jukebox'),
    )

    id = models.AutoField(primary_key=True)
    default_name = models.CharField(max_length=255, blank=True)
    video = models.ForeignKey(
        Video, null=True, blank=True, on_delete=models.SET_NULL)
    schedulereason = models.IntegerField(blank=True, choices=SCHEDULE_REASONS)
    starttime = models.DateTimeField()
    duration = models.DurationField()

    objects = ScheduleitemManager()

    class Meta:
        verbose_name = 'TX schedule entry'
        verbose_name_plural = 'TX schedule entries'
        ordering = ('-id',)

    @staticmethod
    @receiver([post_save, post_delete])
    def _clear_cache(**kwargs):
        # logger.warning('[Scheduleitem] cache flush')
        caches['schedule'].clear()

    def __str__(self):
        t = self.starttime
        s = t.strftime("%Y-%m-%d %H:%M:%S")
        # format microsecond to hundreths
        s += ".%02i" % (t.microsecond / 10000)
        if self.video:
            return str(s) + ": " + str(self.video)
        else:
            return str(s) + ": " + self.default_name

    def endtime(self):
        if not self.duration:
            return self.starttime
        return self.starttime + self.duration


class SchedulePurpose(models.Model):
    """
    A block of video files having a similar purpose.

    Either an organization and its videos (takes preference) or manually
    connected videos.
    """
    STRATEGY = Choices('latest', 'random', 'least_scheduled')
    TYPE = Choices('videos', 'organization')

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=32, choices=TYPE)
    strategy = models.CharField(max_length=32, choices=STRATEGY)

    # You probably need one of these depending on type and strategy
    organization = models.ForeignKey(
        Organization, blank=True, null=True, on_delete=models.SET_NULL)
    direct_videos = models.ManyToManyField(Video, blank=True)

    class Meta:
        ordering = ('-id',)

    def videos_str(self):
        return ", ".join([str(x) for x in self.videos_queryset()])
    videos_str.short_description = "videos"
    videos_str.admin_order_field = "videos"

    def videos_queryset(self, max_duration=None):
        """
        Get the queryset for the available videos
        """
        if self.type == self.TYPE.organization:
            qs = self.organization.video_set.all()
        elif self.type == self.TYPE.videos:
            qs = self.direct_videos.all()
        else:
            raise Exception("Unhandled type %s" % self.type)
        if max_duration:
            qs = qs.filter(duration__lte=max_duration)
        # Workaround playout not handling broken files correctly
        qs = qs.filter(proper_import=True)
        return qs

    def single_video(self, max_duration=None):
        """
        Get a single video based on the settings of this purpose
        """
        qs = self.videos_queryset(max_duration)
        if self.strategy == self.STRATEGY.latest:
            try:
                return qs.latest()
            except Video.DoesNotExist:
                return None
        elif self.strategy == self.STRATEGY.random:
            # This might be slow, but hopefully few records
            return qs.order_by('?').first()
        elif self.strategy == self.STRATEGY.least_scheduled:
            # Get the video which has been scheduled the least
            return (qs.annotate(num_sched=models.Count('scheduleitem'))
                    .order_by('num_sched').first())
        else:
            raise Exception("Unhandled strategy %s" % self.strategy)

    def __str__(self):
        return self.name


class WeeklySlot(models.Model):
    DAY_OF_THE_WEEK = (
        (0, _('Monday')),
        (1, _('Tuesday')),
        (2, _('Wednesday')),
        (3, _('Thursday')),
        (4, _('Friday')),
        (5, _('Saturday')),
        (6, _('Sunday')),
    )

    purpose = models.ForeignKey(
        SchedulePurpose, null=True, blank=True, on_delete=models.SET_NULL)
    day = models.IntegerField(
        choices=DAY_OF_THE_WEEK,
    )
    start_time = models.TimeField()
    duration = models.DurationField()

    class Meta:
        ordering = ('day', 'start_time', 'pk')

    @property
    def end_time(self):
        if not self.duration:
            return self.start_time
        return self.start_time + self.duration

    def next_date(self, from_date=None):
        if not from_date:
            from_date = datetime.date.today()
        days_ahead = self.day - from_date.weekday()
        if days_ahead <= 0:
            # target date already happened this week
            days_ahead += 7
        return from_date + datetime.timedelta(days_ahead)

    def next_datetime(self, from_date=None):
        next_date = self.next_date(from_date)
        naive_dt = datetime.datetime.combine(next_date, self.start_time)
        tz = ZoneInfo(settings.TIME_ZONE)
        return tz.localize(naive_dt)

    def __str__(self):
        return ("{day} {s.start_time} ({s.purpose})"
                "".format(day=self.get_day_display(), s=self))


class AsRun(TimeStampedModel):
    """
    AsRun model is a historic log over what was sent through playout.

    `video` - Points to the Video which was played if there is one.
              Can be empty if something other than a video was played.
              The field is mutually exclusive with `program_name`.

    `program_name` - A free form text input saying what was played.
                     If `video` is set, this field should not be set.
                     Examples of where you'd use this field is e.g.
                     when broadcasting live.
                     Defaults to the empty string.

    `playout` - The playout this entry corresponds with. This will
                almost always be 'main' which it defaults to.

    `played_at` - Time when the playout started.  Defaults to now.

    `in_ms` - The inpoint where the video/stream was started at.
              In milliseconds.  Normally 0 which it defaults to.

    `out_ms` - The outpoint where the video/stream stopped.
               This would often be the duration of the video, or
               how long we live streamed a particular URL.
               Can be null (None) if this is 'currently happening'.
    """
    video = models.ForeignKey(
        Video, blank=True, null=True, on_delete=models.SET_NULL)
    program_name = models.CharField(max_length=160, blank=True, default='')
    playout = models.CharField(max_length=255, blank=True, default='main')
    played_at = models.DateTimeField(blank=True, default=timezone.now)

    in_ms = models.IntegerField(blank=True, default=0)
    out_ms = models.IntegerField(blank=True, null=True)

    def __str__(self):
        if self.video:
            return '{s.playout} video: {s.video}'.format(s=self)
        return '{s.playout}: {s.program_name}'.format(s=self)

    class Meta:
        ordering = ('-played_at', '-id',)

# This class is actually not managed by Django. It is accessed by the
# media-processor, which manipulates the database directly. It is only
# defined here so that database migrations are handled centrally.


class Asset(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    asset_type = models.CharField(max_length=160)
    location = models.CharField(max_length=160)


class IngestJob(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    job_type = models.CharField(max_length=160)
    percentage_done = models.IntegerField(blank=True, default=0)
    status_text = models.TextField(max_length=1000, default="")
    state = models.CharField(max_length=160, default="pending")
