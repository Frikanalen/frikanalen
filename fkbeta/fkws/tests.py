from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from fk.models import VideoFile, Scheduleitem


class PermissionsTest(APITestCase):
    fixtures = ['test.yaml']

    def _user_auth(self, username):
        user = get_user_model().objects.get(username=username)
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + user.auth_token.key)

    def test_anonymous_can_read_root(self):
        r = self.client.get(reverse('api-root'))
        keys = r.data.keys()
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        for k in ['obtain-token', 'scheduleitems', 'videofiles', 'videos']:
            self.assertIn(k, keys)

    def test_nuug_user_can_read_root(self):
        self._user_auth('nuug_user')
        r = self.client.get(reverse('api-root'))
        keys = r.data.keys()
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        for k in ['obtain-token', 'scheduleitems', 'videofiles', 'videos']:
            self.assertIn(k, keys)

    def test_anonymous_does_not_have_token(self):
        r = self.client.get(reverse('api-token-auth'))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, r.status_code)
        self.assertEqual(error_msg, r.data)

    def test_nuug_user_do_have_token(self):
        self._user_auth('nuug_user')
        r = self.client.get(reverse('api-token-auth'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        self.assertEqual(len(r.data['key']), 40)

    def test_anonymous_can_list_videos(self):
        """
        Will list all videos except ones without proper_import
        """
        r = self.client.get(reverse('api-video-list'))
        videos = [v['name'] for v in r.data['results']]
        self.assertEqual(videos, ['tech video', 'dummy video',
                                  'unpublished video'])
        self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_anonymous_can_list_videofiles(self):
        """
        Will list all videofiles even where parent video not proper_import
        """
        r = self.client.get(reverse('api-videofile-list'))
        video_ids = [v['id'] for v in r.data['results']]
        self.assertEqual(video_ids, [1, 2, 3, 4])
        self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_anonymous_can_list_scheduleitem(self):
        """
        Will list all videofiles even where parent video not proper_import
        """
        r = self.client.get(reverse('api-scheduleitem-list') +
                            '?date=20150101')
        videos = [v['video']['name'] for v in r.data['results']]
        self.assertEqual(videos, ['tech video', 'dummy video'])
        self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_anonymous_can_detail_video(self):
        """
        Can view every video without restriction
        """
        videos = [(1, 'tech video'),
                  (2, 'dummy video'),
                  (3, 'unpublished video'),
                  (4, 'broken video')]
        for id, name in videos:
            r = self.client.get(reverse('api-video-detail', args=(id,),))
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            self.assertEqual(r.data['name'], name)

    def test_anonymous_cannot_add(self):
        list_pages = ('api-video-list', 'api-videofile-list',
                      'api-scheduleitem-list')
        results = []
        for list_page in list_pages:
            r = self.client.post(reverse(list_page), data={})
            results.append((list_page, r.status_code, r.data))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual(
            [(p, status.HTTP_401_UNAUTHORIZED, error_msg)
                for p in list_pages],
            results)

    def test_anonymous_cannot_edit(self):
        detail_pages = ('api-video-detail', 'api-videofile-detail',
                        'api-scheduleitem-detail')
        results = []
        for detail_page in detail_pages:
            r = self.client.post(reverse(detail_page, args=(1,),))
            results.append((detail_page, r.status_code, r.data))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual(
            [(p, status.HTTP_401_UNAUTHORIZED, error_msg)
             for p in detail_pages],
            results)

    def test_nuug_user_can_add_things(self):
        self._user_auth('nuug_user')
        thing_tests = [
            (reverse('api-videofile-list'),
             {'video': 1, 'format': 1, 'filename': 'test.mov',
              'old_filename': 'a'},
             {'id': 5, 'video': 1, 'filename': 'test.mov'}),
            (reverse('api-scheduleitem-list') + '?date=20150101',
             {'video_id': 'http://testserver/api/videos/1',
              'schedulereason': 2, 'starttime': '2015-01-01T10:00:00+00:00',
              'duration': '10000'},
             {'id': 3, 'video_id': 'http://testserver/api/videos/1'}),
        ]
        for url, obj, new_obj in thing_tests:
            r = self.client.post(url, obj)
            self.assertEqual(status.HTTP_201_CREATED, r.status_code)
            self.assertEqual(new_obj,
                             {k: r.data[k] for k in new_obj.keys()})

    def test_nuug_user_can_edit_own_things(self):
        self._user_auth('nuug_user')
        thing_tests = [
            ('api-videofile-detail',
             VideoFile.objects.get(video__name='tech video'),
             'old_filename'),
            ('api-scheduleitem-detail',
             Scheduleitem.objects.get(video__name='tech video'),
             'default_name'),
        ]
        for url_name, obj, attr in thing_tests:
            r = self.client.patch(
                reverse(url_name, args=[obj.id]), {attr: 'test fn'})
            self.assertEqual('test fn', r.data[attr])
            self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_nuug_user_cannot_edit_nonowned_things(self):
        self._user_auth('nuug_user')
        thing_tests = [
            ('api-videofile-detail',
             VideoFile.objects.get(video__name='dummy video'),
             'old_filename'),
            ('api-scheduleitem-detail',
             Scheduleitem.objects.get(video__name='dummy video'),
             'default_name'),
        ]
        for url_name, obj, attr in thing_tests:
            r = self.client.patch(
                reverse(url_name, args=[obj.id]), {attr: 'test fn'})
            self.assertEqual(
                {'detail': 'You do not have permission '
                           'to perform this action.'},
                r.data)
            self.assertEqual(status.HTTP_403_FORBIDDEN, r.status_code)
