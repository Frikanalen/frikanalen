from django.conf import settings
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

import base64
import datetime

from api.auth.views import UserCreate, UserDetail
from fk.models import Scheduleitem, VideoFile


class UserRegistrationTest(APITestCase):
    users = {
        'valid': {
            'email': 'foo@example.com',
            'password': 'foo',
            'first_name': 'John',
            'last_name': 'Smith',
            'date_of_birth': '2020-02-01'
        },
        'invalid_email': {
            'email': 'fooexample.com',
            'password': 'foo',
            'first_name': 'John',
            'last_name': 'Smith',
            'date_of_birth': '2020-02-01'
        }
    }

    def test_creating_new_user(self):
        r = self.client.post(reverse('api-user-create'),
                             self.users['valid'],
                             format='json')
        self.assertEqual(status.HTTP_201_CREATED, r.status_code)

    def test_logging_in_new_user(self):
        r = self.client.post(reverse('api-user-create'),
                             self.users['valid'],
                             format='json')
        self.assertEqual(status.HTTP_201_CREATED, r.status_code)
        login_successful = self.client.login(
            email=self.users['valid']['email'],
            password=self.users['valid']['password'])
        self.assertEqual(login_successful, True)

    def test_duplicate_user_fails(self):
        r = self.client.post(reverse('api-user-create'),
                             self.users['valid'],
                             format='json')
        self.assertEqual(status.HTTP_201_CREATED, r.status_code)

        r = self.client.post(reverse('api-user-create'),
                             self.users['valid'],
                             format='json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)

    def test_invalid_email_fails(self):
        r = self.client.post(reverse('api-user-create'),
                             self.users['invalid_email'],
                             format='json')
        self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)

    def test_fails_without_mandatory_fields(self):
        for missing_mandatory_field in [
                'email', 'first_name', 'last_name', 'date_of_birth'
        ]:
            user_missing_field = dict(self.users['valid'])
            del user_missing_field[missing_mandatory_field]
            r = self.client.post(reverse('api-user-create'),
                                 user_missing_field,
                                 format='json')
            self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)


class UserProfileTests(APITestCase):
    factory = APIRequestFactory()
    email = 'profile_test_user@fake.com'
    password = 'test'

    def _basic_auth_credentials(self):
        credentials = base64.b64encode(
            f'{self.email}:{self.password}'.encode('utf-8'))
        return 'Basic {}'.format(credentials.decode('utf-8'))

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email=self.email,
            password=self.password,
            date_of_birth='1900-01-01')
        first_name = 'Firstname before change'
        last_name = 'Lastname before change'
        phone_number = '+1 800 USA-RAIL'
        self.user.save()

    def tearDown(self):
        if self.user.id is not None:
            self.user.delete()

    def test_user_can_get_token(self):
        client = APIClient()

        client.credentials(HTTP_AUTHORIZATION=self._basic_auth_credentials())
        response = client.get(reverse('api-token-auth'))

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(list(response.data.keys()),
                         ['created', 'key', 'user'])
        self.assertEqual(len(response.data['key']), 40)

    def test_user_get_profile(self):
        req = self.factory.get(reverse('api-user-detail'))
        force_authenticate(req, user=self.user)
        res = UserDetail.as_view()(req)
        self.assertEqual(200, res.status_code)
        self.assertEqual(res.data['email'], self.user.email)
        self.assertEqual(res.data['first_name'], self.user.first_name)
        self.assertEqual(res.data['last_name'], self.user.last_name)
        self.assertEqual(res.data['phone_number'], self.user.phone_number)

    def test_user_update_profile(self):
        req = self.factory.put(reverse('api-user-detail'), {
            'firstName': 'Firstname',
            'lastName': 'Lastname',
            'dateOfBirth': '2000-12-15',
            'phoneNumber': '+47 22 22 55 55'
        },
                               format='json')
        force_authenticate(req, user=self.user)
        res = UserDetail.as_view()(req)
        self.assertEqual(200, res.status_code)
        self.assertEqual('Firstname', self.user.first_name)
        self.assertEqual('Lastname', self.user.last_name)
        self.assertEqual('+47 22 22 55 55', self.user.phone_number)
        self.assertEqual(datetime.date(2000, 12, 15), self.user.date_of_birth)
        self.assertEqual('profile_test_user@fake.com', self.user.email)

    def test_user_can_delete(self):
        req = self.factory.delete(reverse('api-user-detail'),
                                  {'id': self.user.id},
                                  format='json')
        force_authenticate(req, user=self.user)
        res = UserDetail.as_view()(req)
        self.assertEqual(status.HTTP_204_NO_CONTENT, res.status_code)
        self.assertEqual(self.user.id, None)


class PermissionsTest(APITestCase):
    fixtures = ['test.yaml']

    def _user_auth(self, email):
        user = get_user_model().objects.get(email=email)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' +
                                user.auth_token.key)

    def test_anonymous_reading_all_pages_from_root_expecting_status(self):
        pages = [
            ('asrun', status.HTTP_200_OK),
            ('category', status.HTTP_200_OK),
            ('jukebox-csv', status.HTTP_200_OK),
            ('scheduleitems', status.HTTP_200_OK),
            ('videofiles', status.HTTP_200_OK),
            ('videos', status.HTTP_200_OK),
            ('organization', status.HTTP_200_OK),
            ('obtain-token', status.HTTP_401_UNAUTHORIZED),
            ('user', status.HTTP_403_FORBIDDEN),
            ('user/register', status.HTTP_405_METHOD_NOT_ALLOWED),
        ]
        self._helper_test_reading_all_pages_from_root(pages)

    def test_nuug_user_reading_all_pages_from_root_expecting_status(self):
        pages = [
            ('asrun', status.HTTP_200_OK),
            ('category', status.HTTP_200_OK),
            ('jukebox-csv', status.HTTP_200_OK),
            ('obtain-token',
             status.HTTP_401_UNAUTHORIZED),  #FIXME: Should return 200 or 401?
            ('user', status.HTTP_200_OK),
            ('scheduleitems', status.HTTP_200_OK),
            ('videofiles', status.HTTP_200_OK),
            ('videos', status.HTTP_200_OK),
            ('organization', status.HTTP_200_OK),
            ('user/register', status.HTTP_405_METHOD_NOT_ALLOWED),
        ]
        self._user_auth('nuug_user@fake.com')
        self._helper_test_reading_all_pages_from_root(pages)

    def _helper_test_reading_all_pages_from_root(self, pages):
        root_response = self.client.get(reverse('api-root'))
        self.assertEqual(status.HTTP_200_OK, root_response.status_code)
        # Every page exists
        self.assertEqual(set(p[0] for p in pages),
                         set(root_response.data.keys()))
        for name, code in pages:
            url = root_response.data[name]
            page_response = self.client.get(url)
            self.assertEqual(
                code, page_response.status_code,
                "{} status is {} expected {}".format(name,
                                                     page_response.status_code,
                                                     code))

    def test_anonymous_does_not_have_token(self):
        r = self.client.get(reverse('api-token-auth'))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, r.status_code)
        self.assertEqual(error_msg, r.data)

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
        r = self.client.get(
            reverse('api-scheduleitem-list') + '?date=2015-01-01')
        videos = [v['video']['name'] for v in r.data['results']]
        self.assertEqual(videos, ['tech video', 'dummy video'])
        self.assertEqual(status.HTTP_200_OK, r.status_code)

    def test_anonymous_can_detail_video(self):
        """
        Can view every video without restriction
        """
        videos = [(1, 'tech video'), (2, 'dummy video'),
                  (3, 'unpublished video'), (4, 'broken video')]
        for id, name in videos:
            r = self.client.get(reverse(
                'api-video-detail',
                args=(id, ),
            ))
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            self.assertEqual(r.data['name'], name)

    def test_anonymous_can_not_detail_video_upload_token(self):
        """
        Can not see upload_token
        """
        videos = [1, 2, 3, 4]
        for id in videos:
            self.client.logout()
            r = self.client.get(
                reverse(
                    'api-video-upload-token-detail',
                    args=(id, ),
                ))
            self.assertEqual(status.HTTP_403_FORBIDDEN, r.status_code)
            self.assertEqual(
                {'detail': 'Authentication credentials '
                 'were not provided.'}, r.data)

    def test_anonymous_can_list_category(self):
        """
        Will list all category items
        """
        r = self.client.get(reverse('category-list'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        results = r.data['results']
        self.assertEqual(['My Cat', 'Second Category'],
                         [i['name'] for i in results])

    def test_anonymous_can_list_asrun(self):
        """
        Will list all asrun log items
        """
        r = self.client.get(reverse('asrun-list'))
        self.assertEqual(status.HTTP_200_OK, r.status_code)
        results = r.data['results']
        self.assertEqual([(2, 1, '2015-'), (1, 1, '2014-')],
                         [(i['id'], i['video'], i['played_at'][:5])
                          for i in results])

    def test_anonymous_cannot_add(self):
        list_pages = ('api-video-list', 'api-videofile-list',
                      'api-scheduleitem-list', 'asrun-list', 'category-list')
        results = []
        for list_page in list_pages:
            r = self.client.post(reverse(list_page), data={})
            results.append((list_page, r.status_code, r.data))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual([(p, status.HTTP_403_FORBIDDEN, error_msg)
                          for p in list_pages], results)

    def test_anonymous_cannot_edit(self):
        self.maxDiff = None
        detail_pages = ('api-video-detail', 'api-videofile-detail',
                        'api-scheduleitem-detail', 'asrun-detail')
        results = []
        for detail_page in detail_pages:
            r = self.client.post(reverse(
                detail_page,
                args=(1, ),
            ))
            results.append((detail_page, r.status_code, r.data))
        error_msg = {'detail': 'Authentication credentials were not provided.'}
        self.assertEqual([(p, status.HTTP_403_FORBIDDEN, error_msg)
                          for p in detail_pages], results)

    def test_nuug_user_can_edit_profile(self):
        date_of_birth = datetime.date(year=1984, month=6, day=7)
        self._user_auth('nuug_user@fake.com')
        r = self.client.get(reverse('api-user-detail'))
        self.assertEqual(200, r.status_code)
        r = self.client.patch(reverse('api-user-detail'), {
            'first_name': 'Firstname',
            'last_name': 'Lastname',
            'date_of_birth': date_of_birth,
            'email': 'this_should_be_immutable@fake.com',
        },
                              format='json')
        self.assertEqual(200, r.status_code)
        # This will fail if email wasn't immutable, it should probably
        # return something else than 200 if I try to patch read-only
        # values but there you go
        u = get_user_model().objects.get(email='nuug_user@fake.com')
        self.assertEqual('Firstname', u.first_name)
        self.assertEqual('Lastname', u.last_name)
        self.assertEqual(date_of_birth, u.date_of_birth)
        # Uncomment when https://github.com/Frikanalen/frikanalen/issues/77 is fixed
        #self.assertEqual('Norway', u.userprofile.country)

    def test_nuug_user_can_add_things(self):
        self._user_auth('nuug_user@fake.com')
        # [(url, object_to_post, object_to_test_against, status)]
        tests = [
            (
                reverse('api-videofile-list'),
                {
                    'video': 1,
                    'format': 1,
                    'filename': 'test.mov'
                },
                {
                    'id': 5,
                    'video': 1,
                    'filename': 'test.mov'
                },
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-video-list'),
                {
                    'name': 'created test video',
                    'duration': '01:2.3',
                    'organization': 1,
                    'categories': ['My Cat']
                },  # FIXME: Don't hardcode the org this way
                {
                    'id': 5,
                    'name': 'created test video',
                    'duration': '00:01:02.300000',
                    'categories': ['My Cat'],
                    'organization': 1,
                    'creator': 'nuug_user@fake.com'
                },
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-scheduleitem-list') + '?date=20150101',
                {
                    'video': 1,
                    'schedulereason': Scheduleitem.REASON_ADMIN,
                    'starttime': '2015-01-01T11:00:00Z',
                    'duration': '0:00:00.10'
                },
                {
                    'id': 3,
                    'video': 1,
                    'duration': '00:00:00.100000'
                },
                status.HTTP_201_CREATED,
            ),
            (
                reverse('asrun-list'),
                {
                    'video': 2,
                    'playedAt': '2015-01-01 11:00:00Z'
                },
                {
                    'detail':
                    'You do not have permission to '
                    'perform this action.'
                },
                status.HTTP_403_FORBIDDEN,
            ),
        ]
        self._helper_test_add_things(tests)

    def test_staff_user_can_add_things(self):
        self._user_auth('staff_user@fake.com')
        # [(url, object_to_post, object_to_test_against, status)]
        tests = [
            (
                reverse('api-videofile-list'),
                {
                    'video': 1,
                    'format': 1,
                    'filename': 'test.mov'
                },
                {
                    'id': 5,
                    'video': 1,
                    'filename': 'test.mov'
                },
                status.HTTP_201_CREATED,
            ),
            (
                reverse('api-scheduleitem-list') + '?date=20150101',
                {
                    'video': 1,
                    'schedulereason': Scheduleitem.REASON_ADMIN,
                    'starttime': '2015-01-01T11:00:00Z',
                    'duration': '0:00:13.10'
                },
                {
                    'id': 3,
                    'video': 1,
                    'duration': '00:00:13.100000'
                },
                status.HTTP_201_CREATED,
            ),
            (
                reverse('asrun-list'),
                {
                    'video': 2,
                    'played_at': '2015-01-01T11:00:00+00:00'
                },
                {
                    'id': 3,
                    'video': 2,
                    'playout': 'main'
                },
                status.HTTP_201_CREATED,
            ),
        ]
        self._helper_test_add_things(tests)

    def _helper_test_add_things(self, tests):
        for test_num, test in enumerate(tests):
            (url, obj, response_obj, exp_status) = test
            r = self.client.post(url, obj, format='json')
            self.assertEqual(
                exp_status, r.status_code,
                f"Test {test_num}/{len(tests)}: Expected status {exp_status} but got {r.status_code} (for {url})"
            )
            self.assertEqual(response_obj,
                             {k: r.data[k]
                              for k in list(response_obj.keys())})

    def test_nuug_user_can_edit_own_things(self):
        self._user_auth('nuug_user@fake.com')
        thing_tests = [
            ('api-videofile-detail',
             VideoFile.objects.get(video__name='tech video'), 'filename'),
        ]
        for url_name, obj, attr in thing_tests:
            r = self.client.patch(reverse(url_name, args=[obj.id]),
                                  {attr: 'test fn'},
                                  format='json')
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            self.assertEqual('test fn', r.data[attr])

    def test_staff_user_can_edit_nonowned_things(self):
        self._user_auth('staff_user@fake.com')
        thing_tests = [
            ('api-videofile-detail',
             VideoFile.objects.get(video__name='tech video'), 'filename'),
        ]
        for url_name, obj, attr in thing_tests:
            r = self.client.patch(reverse(url_name, args=[obj.id]),
                                  {attr: 'test fn'},
                                  format='json')
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            self.assertEqual('test fn', r.data[attr])

    def test_nuug_user_cannot_edit_nonowned_things(self):
        self._user_auth('nuug_user@fake.com')
        thing_tests = [
            ('api-videofile-detail',
             VideoFile.objects.get(video__name='dummy video'), 'filename'),
            ('api-scheduleitem-detail',
             Scheduleitem.objects.get(video__name='dummy video'),
             'default_name'),
        ]
        for url_name, obj, attr in thing_tests:
            r = self.client.patch(reverse(url_name, args=[obj.id]),
                                  {attr: 'test fn'})
            self.assertEqual(
                {
                    'detail':
                    'You do not have permission '
                    'to perform this action.'
                }, r.data)
            self.assertEqual(status.HTTP_403_FORBIDDEN, r.status_code)

    def test_staff_user_can_see_all_upload_tokens(self):
        self._user_auth('staff_user@fake.com')
        thing_tests = [
            (VideoFile.objects.get(video__name='tech video'), 200, {
                'upload_token': 'deadbeef',
                'upload_url': settings.FK_UPLOAD_URL
            }),
        ]
        self._get_upload_token_helper(thing_tests)

    def test_nuug_user_can_only_see_own_upload_tokens(self):
        self._user_auth('nuug_user@fake.com')
        thing_tests = [
            (VideoFile.objects.get(video__name='tech video'), 200, {
                'upload_token': 'deadbeef',
                'upload_url': settings.FK_UPLOAD_URL
            }),
            (VideoFile.objects.get(video__name='dummy video'), 403, {
                'detail': 'You do not have permission '
                'to perform this action.'
            }),
        ]
        self._get_upload_token_helper(thing_tests)

    def _get_upload_token_helper(self, thing_tests):
        for obj, status, data in thing_tests:
            r = self.client.get(
                reverse('api-video-upload-token-detail', args=[obj.id]))
            self.assertEqual(data, r.data)
            self.assertEqual(status, r.status_code)
