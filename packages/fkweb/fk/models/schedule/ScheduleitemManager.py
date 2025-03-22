from fk.models import Scheduleitem


import pytz
from django.db import models
from django.utils import timezone


import datetime


class ScheduleitemManager(models.Manager):
    def by_day(self, date=None, days=1, surrounding=False):
        if not date:
            date = timezone.now().astimezone(pytz.timezone('Europe/Oslo')).date()
        elif hasattr(date, 'date'):
            date.replace(tzinfo=timezone.get_current_timezone())
            date = date.date()
        startdt = datetime.datetime.combine(
            date, datetime.time(0, tzinfo=pytz.timezone('Europe/Oslo')))
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
