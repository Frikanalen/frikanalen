# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
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
