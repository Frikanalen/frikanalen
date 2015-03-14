# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import datetime
import functools

from django.test import TestCase
from django.utils import timezone

from fk.models import Scheduleitem


class WebPageTest(TestCase):
    fixtures = ['test.yaml']

    def test_video_listing(self):
        r = self.client.get('/video/')
        self.assertEqual(['dummy video', 'tech video'],
                         [v.name for v in r.context['videos']])
        self.assertContains(r, 'dummy video', count=1)
        self.assertContains(r, 'tech video', count=1)

    def test_video_detail(self):
        r = self.client.get('/video/1')
        self.assertContains(
            r, 'First broadcast: <i>Jan. 1, 2015, 10 a.m.</i>', count=1)
        self.assertContains(r, '<h1>Video not available</h1>', count=1)
        self.assertContains(r, '<a href="/organization/1">NUUG</a>', count=1)

    def test_video_guide(self):
        sched = Scheduleitem.objects.get(video__name='tech video')
        sched.starttime = timezone.now()
        sched.save()
        r = self.client.get('/guide/')
        self.assertContains(r, '<li class="event"', count=1)
        self.assertContains(r, 'tech video', count=1)


class ScheduleitemModelTests(TestCase):
    fixtures = ['test.yaml']

    def test_by_day(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-04 00:50'),
            c('2014-04-04 14:50'),
            c('2014-04-04 23:50'),
            c('2014-04-05 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date)
        self.assertEqual(items[1:4], list(by_day_items))

    def test_by_zero(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-05 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date)
        self.assertEqual(items[0:0], list(by_day_items))

    def test_by_zero_surrounding(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-05 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date, surrounding=True)
        self.assertEqual(items, list(by_day_items))

    def test_by_day_only_one(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-04 23:50'),
            c('2014-04-05 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date)
        self.assertEqual(items[1:2], list(by_day_items))

    def test_by_day_only_one_surrounding(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-01 23:30'),
            c('2014-04-04 23:50'),
            c('2014-04-08 00:10'),
            c('2014-04-09 07:10'),
        ]
        date = datetime.date(2014, 4, 8)
        by_day_items = Scheduleitem.objects.by_day(date, surrounding=True)
        self.assertEqual(items[1:], list(by_day_items))

    def test_by_day_surrounding(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:31'),
            c('2014-04-03 23:50'),
            c('2014-04-04 00:50'),
            c('2014-04-04 14:50'),
            c('2014-04-04 23:50'),
            c('2014-04-05 00:10'),
            c('2014-04-05 00:20'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date, surrounding=True)
        self.assertEqual(items[1:-1], list(by_day_items))

    def test_by_day_more_days(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-04 00:10'),
            c('2014-04-04 23:50'),
            c('2014-04-05 00:10'),
            c('2014-04-05 23:50'),
            c('2014-04-06 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date, days=2)
        self.assertEqual(items[1:-1], list(by_day_items))

    def test_by_day_more_days_surrounding(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-04 23:50'),
            c('2014-04-05 23:50'),
            c('2014-04-06 00:10'),
        ]
        date = datetime.date(2014, 4, 4)
        by_day_items = Scheduleitem.objects.by_day(date, days=2,
                                                   surrounding=True)
        self.assertEqual(items, list(by_day_items))

    def test_by_day_datetime(self):
        c = lambda x: create_scheduleitem(starttime=parse_to_datetime(x))
        items = [
            c('2014-04-03 23:50'),
            c('2014-04-04 12:50'),
            c('2014-04-04 23:50'),
            c('2014-04-05 00:10'),
        ]
        dt = parse_to_datetime('2014-04-04 13:50')
        by_day_items = Scheduleitem.objects.by_day(dt)
        self.assertEqual(items[1:-1], list(by_day_items))


def create_scheduleitem(starttime=None):
    if starttime is None:
        starttime = timezone.now()
    return Scheduleitem.objects.create(
        video_id=1, duration=10,
        schedulereason=1,
        starttime=starttime)


def parse_to_datetime(dt_str):
    dt = datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
    return timezone.make_aware(dt, timezone.get_current_timezone())
