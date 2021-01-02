from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

import base64
import datetime

from .views import UserDetail
from .views import UserCreate

class UserRegistrationTests(APITestCase):
    factory = APIRequestFactory()

    def test_valid_registration(self):
        fields = {
                'email': 'foo@bar.com',
                'first_name': 'Firstname',
                'last_name': 'Lastname',
                'password': 'Test',
                'date_of_birth': datetime.date(1920, 1, 1)
                }
        req = self.factory.post(
            reverse('api-user-create'), fields
            )
        res = UserCreate.as_view()(req)
        self.assertEqual(status.HTTP_201_CREATED, res.status_code)
        user = get_user_model().objects.get(email=fields['email'])
        for k,v in fields.items():
            if k in ('password', 'date_of_birth'): continue
            self.assertEqual(res.data[k], getattr(user, k))

    def test_registration_missing_mandatory_fields(self):
        fields = {
                'email': 'foo@bar.com',
                'first_name': 'Firstname',
                'last_name': 'Lastname',
                'password': 'Test',
                }
        req = self.factory.post(
            reverse('api-user-create'), fields
            )
        res = UserCreate.as_view()(req)
        self.assertEqual(status.HTTP_400_BAD_REQUEST, res.status_code)

class UserProfileTests(APITestCase):
    factory = APIRequestFactory()
    email = 'profile_test_user@fake.com'
    password = 'test'

    def _basic_auth_credentials(self):
        credentials = base64.b64encode(f'{self.email}:{self.password}'.encode('utf-8'))
        return 'Basic {}'.format(credentials.decode('utf-8'))

    def setUp(self):
        self.user = get_user_model().objects.create_user(
                email = self.email,
                password = self.password,
                date_of_birth = '1900-01-01'
                )
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
        self.assertEqual(list(response.data.keys()), ['created', 'key', 'user'])
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
        req = self.factory.put(
            reverse('api-user-detail'), {
                'first_name': 'Firstname',
                'last_name':  'Lastname',
                'date_of_birth':  '2000-12-15',
                'phone_number': '+47 22 22 55 55'
            })
        force_authenticate(req, user=self.user)
        res = UserDetail.as_view()(req)
        self.assertEqual(200, res.status_code)
        self.assertEqual('Firstname', self.user.first_name)
        self.assertEqual('Lastname', self.user.last_name)
        self.assertEqual('+47 22 22 55 55', self.user.phone_number)
        self.assertEqual(datetime.date(2000, 12, 15), self.user.date_of_birth)
        self.assertEqual('profile_test_user@fake.com', self.user.email)

    def test_user_can_delete(self):
        req = self.factory.delete(
            reverse('api-user-detail'), {
                'id': self.user.id
                }
            )
        force_authenticate(req, user=self.user)
        res = UserDetail.as_view()(req)
        self.assertEqual(status.HTTP_204_NO_CONTENT, res.status_code)
        self.assertEqual(self.user.id, None)
