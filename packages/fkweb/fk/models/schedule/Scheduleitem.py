from fk.models import ScheduleitemManager
from fk.models import Video


from django.core.cache import caches
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


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
