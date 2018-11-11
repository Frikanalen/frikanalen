# Copyright (c) 2018 Petter Reinholdtsen <pere@hungry.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.test import TestCase
from django.core.urlresolvers import reverse

class VodTests(TestCase):
    fixtures = ['test.yaml']

    def test_video_list(self):
        response = self.client.get(reverse('vod-video-list'))
        self.assertContains(response, 'RSS', count=1)

    def test_video_detail(self):
        response = self.client.get(reverse('vod-video-detail', args=[1]))
        self.assertContains(response, 'Category', count=1)
