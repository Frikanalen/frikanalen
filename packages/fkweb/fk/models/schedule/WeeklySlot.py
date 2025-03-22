from fk.models import SchedulePurpose


import pytz
from django.conf import settings
from django.db import models
from django.utils.translation import gettext as _


import datetime


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
        tz = pytz.timezone(settings.TIME_ZONE)
        return tz.localize(naive_dt)

    def __str__(self):
        return ("{day} {s.start_time} ({s.purpose})"
                "".format(day=self.get_day_display(), s=self))
