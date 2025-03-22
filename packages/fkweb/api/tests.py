from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class FilterTest(APITestCase):
    fixtures = ['test.yaml']

    def setUp(self):
        self.client.login(email='staff_user@fake.com', password='test')

    def list_lookup(self, urlname, fieldname, lookups):
        for lookup, expect in lookups:
            url = reverse(urlname) + lookup
            r = self.client.get(url)
            self.assertEqual(status.HTTP_200_OK, r.status_code,
                             f"lookup '{url}' did not return status 200")
            videos = [v[fieldname] for v in r.data['results']]
            self.assertEqual(
                expect, videos, "%s lookup '%s' expect %s got %s" %
                (urlname, url, expect, videos))

    def test_can_filter_video(self):
        lookups = [
            ('?duration=01:00', ['dummy video']),
            ('?duration__gte=01:00', ['dummy video']),
            ('?duration__lt=01:00', ['unpublished video', 'tech video']),
            ('?has_tono_records=false', ['dummy video', 'tech video']),
            ('?has_tono_records=true', ['unpublished video']),
            ('?framerate=24000', ['dummy video']),
            ('?framerate=25000', ['unpublished video', 'tech video']),
            ('?name=dummy', []),
            ('?name=dummy+video', ['dummy video']),
            ('?name__icontains=Dum', ['dummy video']),
            ('?name__icontains=u', [
                'unpublished video',
                'dummy video',
            ]),
            ('?played_count_web__gt=1', []),
            ('?played_count_web__gte=0',
             ['unpublished video', 'dummy video', 'tech video']),
            ('?publish_on_web=false', ['unpublished video']),
            ('?publish_on_web=true&name__icontains=unpublish', []),
            ('?ref_url=a', ['tech video']),
            ('?ref_url=b', ['dummy video']),
            ('?ref_url__startswith=b', ['dummy video']),
            ('?ref_url__startswith=a', ['unpublished video', 'tech video']),
            ('?creator__email=nuug', []),
            ('?creator__email=nuug_user@fake.com', ['tech video']),
            ('?creator__email=dummy_user@fake.com&name=', ['dummy video']),
            ('?proper_import=false', ['broken video']),
            ('?proper_import=true',
             ['unpublished video', 'dummy video', 'tech video']),
        ]
        self.list_lookup('api-video-list', 'name', lookups)

    def test_can_filter_videofile(self):
        lookups = [
            ('?video_id=1', ['tech_video.mp4']),
            ('?video_id=2', ['dummy_video.mov']),
            ('?format__fsname=broadcast', ['unpublished_video.dv']),
            ('?integrated_lufs=-23', ['broken_video.mov']),
            ('?integrated_lufs__lte=-23',
             ['broken_video.mov', 'unpublished_video.dv']),
            ('?integrated_lufs__lt=-23', ['unpublished_video.dv']),
            ('?integrated_lufs__gt=-23', ['dummy_video.mov']),
            ('?integrated_lufs__gte=-23',
             ['broken_video.mov', 'dummy_video.mov']),
            ('?integrated_lufs__isnull=True', ['tech_video.mp4']),
        ]
        self.list_lookup('api-videofile-list', 'filename', lookups)
