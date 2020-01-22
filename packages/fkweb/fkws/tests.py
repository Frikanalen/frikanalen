from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase

from fk.models import VideoFile, Scheduleitem


class PermissionsTest(APITestCase):
    fixtures = ['test.yaml']

    def _user_auth(self, email):
        user = get_user_model().objects.get(email=email)
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + user.auth_token.key)

    def test_anonymous_reading_all_pages_from_root_expecting_status(self):
        pages = [
            ('asrun', status.HTTP_200_OK),
            ('category', status.HTTP_200_OK),
            ('jukebox-csv', status.HTTP_200_OK),
            ('scheduleitems', status.HTTP_200_OK),
            ('videofiles', status.HTTP_200_OK),
            ('videos', status.HTTP_200_OK),
            ('obtain-token', status.HTTP_401_UNAUTHORIZED),
        ]
        self._helper_test_reading_all_pages_from_root(pages)

    def test_nuug_user_reading_all_pages_from_root_expecting_status(self):
        pages = [
            ('asrun', status.HTTP_200_OK),
            ('category', status.HTTP_200_OK),
            ('jukebox-csv', status.HTTP_200_OK),
            ('obtain-token', status.HTTP_200_OK),
            ('scheduleitems', status.HTTP_200_OK),
            ('videofiles', status.HTTP_200_OK),
            ('videos', status.HTTP_200_OK),
        ]
        self._user_auth('nuug_user')
        self._helper_test_reading_all_pages_from_root(pages)

    def _helper_test_reading_all_pages_from_root(self, pages):
        root_response = self.client.get(reverse('api-root'))
        self.assertEqual(status.HTTP_200_OK, root_response.status_code)
        # Every page exists
        self.assertEqual(
            set(p[0] for p in pages), set(root_response.data.keys()))
        for name, code in pages:
            url = root_response.data[name]
            page_response = self.client.get(url)
            self.assertEqual(
                code, page_response.status_code,
                "{} status is {} expected {}"
                .format(name, page_response.status_code, code))

    def test_anonymous_does_not_have_token(self):
        r = self.client.get(reverse('api-token-auth'))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, r.status_code)
        self.assertEqual(error_msg, r.data)

    def test_nuug_user_do_have_token(self):
        self._user_auth('nuug_user')
        r = self.client.get(reverse('api-token-auth'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        self.assertEqual(list(r.data.keys()), ['created', 'key', 'user'])
        self.assertEqual(len(r.data['key']), 40)

    def test_anonymous_can_list_videos(self):
        """
        Will list all videos except ones without proper_import
        """
        r = self.client.get(reverse('api-video-list'))
        videos = [v['name'] for v in r.data['results']]
        self.assertEqual(videos, [
            'unpublished video',
            'dummy video',
            'tech video',
        ])
        self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_anonymous_can_list_videofiles(self):
        """
        Will list all videofiles even where parent video not proper_import
        """
        r = self.client.get(reverse('api-videofile-list'))
        video_ids = [v['id'] for v in r.data['results']]
        self.assertEqual(video_ids, [4, 3, 2, 1])
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

    def test_anonymous_can_not_detail_video_upload_token(self):
        """
        Can not see upload_token
        """
        videos = [1, 2, 3, 4]
        for id in videos:
            r = self.client.get(reverse('api-video-upload-token-detail', args=(id,),))
            self.assertEqual(status.HTTP_401_UNAUTHORIZED, r.status_code)
            self.assertEqual({'detail': 'Authentication credentials '
                                        'were not provided.'},
                              r.data)

    def test_anonymous_can_list_category(self):
        """
        Will list all category items
        """
        r = self.client.get(reverse('category-list'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        results = r.data['results']
        self.assertEqual(
            ['My Cat', 'Second Category'],
            [i['name'] for i in results])

    def test_anonymous_can_list_asrun(self):
        """
        Will list all asrun log items
        """
        r = self.client.get(reverse('asrun-list'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        results = r.data['results']
        self.assertEqual(
            [(2, 1, '2015-'), (1, 1, '2014-')],
            [(i['id'], i['video'], i['played_at'][:5]) for i in results])

    def test_anonymous_cannot_add(self):
        list_pages = ('api-video-list', 'api-videofile-list',
                      'api-scheduleitem-list', 'asrun-list',
                      'category-list')
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
                        'api-scheduleitem-detail', 'asrun-detail')
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
        # [(url, object_to_post, object_to_test_against, status)]
        tests = [
            (
                reverse('api-videofile-list'),
                {'video': 1, 'format': 1, 'filename': 'test.mov',
                 'old_filename': 'a'},
                {'id': 5, 'video': 1, 'filename': 'test.mov'},
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-video-list'),
                {'name': 'created test video', 'duration': '01:2.3',
                 'organization': 'Dummy org'}, # this should actually fail
                {'id': 5, 'name': 'created test video',
                    'duration': '00:01:02.300000', 'categories': [],
                    'organization': 'Dummy org', 'editor': 'nuug_user'},
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-scheduleitem-list') + '?date=20150101',
                {'video_id': 'http://testserver/api/videos/1',
                 'schedulereason': Scheduleitem.REASON_ADMIN, 'starttime': '2015-01-01T11:00:00Z',
                 'duration': '0:00:00.10'},
                {'id': 3, 'video_id': 'http://testserver/api/videos/1',
                 'duration': '00:00:00.100000'},
                status.HTTP_201_CREATED,
            ),
            (
                reverse('asrun-list'),
                {'video': 2, 'played_at': '2015-01-01 11:00:00Z'},
                {'detail': 'You do not have permission to '
                           'perform this action.'},
                status.HTTP_403_FORBIDDEN,
            ),
        ]
        self._helper_test_add_things(tests)

    def test_staff_user_can_add_things(self):
        self._user_auth('staff_user')
        # [(url, object_to_post, object_to_test_against, status)]
        tests = [
            (
                reverse('api-videofile-list'),
                {'video': 1, 'format': 1, 'filename': 'test.mov',
                 'old_filename': 'a'},
                {'id': 5, 'video': 1, 'filename': 'test.mov'},
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-scheduleitem-list') + '?date=20150101',
                {'video_id': 'http://testserver/api/videos/1',
                 'schedulereason': Scheduleitem.REASON_ADMIN, 'starttime': '2015-01-01T11:00:00Z',
                 'duration': '0:00:13.10'},
                {'id': 3, 'video_id': 'http://testserver/api/videos/1',
                 'duration': '00:00:13.100000'},
                status.HTTP_201_CREATED,
            ),
            (
                reverse('asrun-list'),
                {'video': 2, 'played_at': '2015-01-01T11:00:00+00:00'},
                {'id': 3, 'video': 2, 'playout': 'main'},
                status.HTTP_201_CREATED,
            ),
        ]
        self._helper_test_add_things(tests)

    def _helper_test_add_things(self, tests):
        for url, obj, response_obj, exp_status in tests:
            r = self.client.post(url, obj)
            self.assertEqual(exp_status, r.status_code,
                             "Expected status {} but got {} (for {})"
                             .format(exp_status, r.status_code, url))
            self.assertEqual(response_obj,
                             {k: r.data[k] for k in list(response_obj.keys())})

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

    def test_staff_user_can_edit_nonowned_things(self):
        self._user_auth('staff_user')
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

    def test_staff_user_can_see_all_upload_tokens(self):
        self._user_auth('staff_user')
        thing_tests = [
            (VideoFile.objects.get(video__name='tech video'),
             200, {'upload_token': 'deadbeef', 'upload_url': settings.FK_UPLOAD_URL}),
            (VideoFile.objects.get(video__name='dummy video'),
             200, {'upload_token': '', 'upload_url': settings.FK_UPLOAD_URL}),
        ]
        self._get_upload_token_helper(thing_tests)

    def test_nuug_user_can_only_see_own_upload_tokens(self):
        self._user_auth('nuug_user')
        thing_tests = [
            (VideoFile.objects.get(video__name='tech video'),
             200, {'upload_token': 'deadbeef', 'upload_url': settings.FK_UPLOAD_URL}),
            (VideoFile.objects.get(video__name='dummy video'),
             403, {'detail': 'You do not have permission '
                             'to perform this action.'}),
        ]
        self._get_upload_token_helper(thing_tests)

    def _get_upload_token_helper(self, thing_tests):
        for obj, status, data in thing_tests:
            r = self.client.get(
                reverse('api-video-upload-token-detail', args=[obj.id]))
            self.assertEqual(data, r.data)
            self.assertEqual(status, r.status_code)


class FilterTest(APITestCase):
    fixtures = ['test.yaml']

    def setUp(self):
        self.client.login(email='staff_user', password='test')

    def list_lookup(self, urlname, fieldname, lookups):
        for lookup, expect in lookups:
            url = reverse(urlname) + lookup
            r = self.client.get(url)
            self.assertEqual(status.HTTP_200_OK, r.status_code,
                             "lookup '%s' did not return status 200" % url)
            videos = [v[fieldname] for v in r.data['results']]
            self.assertEqual(expect, videos,
                             "%s lookup '%s' expect %s got %s" % (
                                 urlname, url, expect, videos)
            )

    def test_can_filter_video(self):
        lookups = [
            ('?duration=01:00', ['dummy video']),
            ('?duration__gte=01:00', ['dummy video']),
            ('?duration__lt=01:00', ['unpublished video', 'tech video']),
            ('?has_tono_records=false', ['dummy video','tech video']),
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
            ('?played_count_web__gte=0', ['unpublished video', 'dummy video', 'tech video']),
            ('?publish_on_web=false', ['unpublished video']),
            ('?publish_on_web=true&name__icontains=unpublish', []),
            ('?ref_url=a', ['tech video']),
            ('?ref_url=b', ['dummy video']),
            ('?ref_url__startswith=b', ['dummy video']),
            ('?ref_url__startswith=a', ['unpublished video', 'tech video']),
            ('?editor__email=nuug', []),
            ('?editor__email=nuug_user', ['tech video']),
            ('?editor__email=dummy_user&name=', ['dummy video']),
            ('?proper_import=false', ['broken video']),
            ('?proper_import=true', ['unpublished video', 'dummy video', 'tech video']),
        ]
        self.list_lookup('api-video-list', 'name', lookups)


    def test_can_filter_videofile(self):
        lookups = [
            ('?video_id=1', ['tech_video.mp4']),
            ('?video_id=2', ['dummy_video.mov']),
            ('?format__fsname=broadcast', ['unpublished_video.dv']),
            ('?integrated_lufs=-23',      ['broken_video.mov']),
            ('?integrated_lufs__lte=-23', ['broken_video.mov', 'unpublished_video.dv']),
            ('?integrated_lufs__lt=-23',  ['unpublished_video.dv']),
            ('?integrated_lufs__gt=-23',  ['dummy_video.mov']),
            ('?integrated_lufs__gte=-23', ['broken_video.mov', 'dummy_video.mov']),
            ('?integrated_lufs__isnull=True', ['tech_video.mp4']),
        ]
        self.list_lookup('api-videofile-list', 'filename', lookups)


class ScheduleitemTest(APITestCase):
    fixtures = ['test.yaml']

    def setUp(self):
        self.client.login(email='staff_user', password='test')

    def test_creating_new_scheduleitem(self):
        # Rest Framework now always sends back dates using configured TZ
        times = [
            ('2015-01-01T11:00:00Z', '2015-01-01T11:00:00Z'),
            ('2015-01-01T08:59:00Z', '2015-01-01T08:59:00Z'),
            ('2015-01-01T09:58:00+01:00', '2015-01-01T08:58:00Z'),
            ('2015-01-01T11:00:59Z', '2015-01-01T11:00:59Z'),
        ]
        for given_time, returned_time in times:
            r = self.client.post(
                reverse('api-scheduleitem-list'),
                {'video_id': '/api/videos/2',
                 'starttime': given_time,
                 'duration': '58.312',
                 'schedulereason': Scheduleitem.REASON_LEGACY})
            self.assertEqual(status.HTTP_201_CREATED, r.status_code)
            self.assertEqual(returned_time, r.data['starttime'])
            self.assertEqual('00:00:58.312000', r.data['duration'])
            self.assertEqual('dummy video', r.data['video']['name'])

    def test_schedule_item_cant_overlap(self):
        times = [
            ('09:00:00.00: tech video', '2015-01-01T08:59:30Z'),
            ('09:00:00.00: tech video', '2015-01-01T09:59:59.999Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:00:00Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:30:00Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:59:59.9Z'),
        ]
        for conflict, starttime in times:
            r = self.client.post(
                reverse('api-scheduleitem-list'),
                {'video_id': '/api/videos/2',
                 'starttime': starttime,
                 'duration': '00:00:58.312',
                 'schedulereason': Scheduleitem.REASON_LEGACY})
            self.assertEqual("Conflict with '2015-01-01 %s'." % conflict,
                             r.data['duration'][0])
            self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)

    def test_schedule_item_can_update(self):
        times = [
            (1, {'starttime': '2015-01-01T08:59:30Z'}),
            (1, {'starttime': '2015-01-01T09:50:00Z', 'duration': '00:09:00'}),
            (2, {'starttime': '2015-01-01T10:00:00Z'}),
            (2, {'starttime': '2015-01-01T10:30:00Z'}),
            (2, {'starttime': '2015-01-01T10:59:59.900000Z'}),
        ]
        for schedule_pk, changes in times:
            changes.update({'schedulereason': Scheduleitem.REASON_LEGACY})
            r = self.client.patch(
                reverse('api-scheduleitem-detail', args=[schedule_pk]),
                changes)
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            for k, v in list(changes.items()):
                if k == 'starttime':
                    p = parse_datetime(v)
                    pk = parse_datetime(r.data[k])
                    self.assertEqual(parse_datetime(v), parse_datetime(r.data[k]))
                else:
                    self.assertEqual(v, r.data[k])

    def test_schedule_item_update_can_not_override(self):
        times = [
            (1, {'duration': '1:10:00'}),
            (1, {'starttime': '2015-01-01T09:50:00Z'}),
            (2, {'starttime': '2015-01-01T09:50:00Z'}),
        ]
        for schedule_pk, changes in times:
            r = self.client.patch(
                reverse('api-scheduleitem-detail', args=[schedule_pk]),
                changes)
            self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)
