# Copyright (c) 2018 Petter Reinholdtsen <pere@hungry.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _

class VodTests(TestCase):
    fixtures = ['test.yaml']

    def test_video_list(self):
        response = self.client.get(reverse('vod-video-list'))
        self.assertContains(response, 'RSS', count=1)

    def test_video_detail(self):
        response = self.client.get(reverse('vod-video-detail', args=[1]))
        self.assertContains(response, _('Category:'), count=1)

    def test_category_list(self):
        response = self.client.get(reverse('vod-category-list'))
        self.assertContains(response, _('All Categories'))

    def test_org_list(self):
        response = self.client.get(reverse('vod-org-video-list', args=[1]))
        self.assertContains(response, _('Videos from %s') % "")
