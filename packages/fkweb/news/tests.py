import string
import random

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

from .models import Bulletin
from .views import BulletinViewSet

class TestArticleList(TestCase):
    def setUp(self):
        def random_string(length):
            def insert_into_string(str, i, word):
                return str[:i].strip() + word + str[i:].strip()
            i = 0
            s = ''.join(random.choices(string.ascii_uppercase, k=length))
            while i < len(s):
                # TODO: If ever super bored, find a better probability distribution
                # for the length of English language words
                i += max((min((int(random.expovariate(0.26))+1), 15,)), 2,)
                punct = random.choices(
                        [' ', ', ', '. ', '! ', '!? '], 
                        weights=[30, 5, 5, 2, 1],  # This is also inelegant
                        k=1)[0]
                s = insert_into_string(s, i, punct)
            return s.strip().capitalize()

        for n in range(0,50):
            heading = random_string(30)
            text = random_string(300)
            Bulletin.objects.create(heading=heading, text=text)

    def test_list(self):
        factory = APIRequestFactory()
        request = factory.get('/api/news/bulletins/', format='json')
        view = BulletinViewSet.as_view(actions={'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 50)
        self.assertIsInstance(response.data[0].get('heading', None), str)
        self.assertIsInstance(response.data[0].get('text', None), str)

class TestUnauthCannotEdit(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create(email="foo@asdf.com", is_superuser=False)

    def test_post(self):
        factory = APIRequestFactory()
        request = factory.post('/api/news/bulletins/', {'heading': 'foo', 'text': 'bar'}, format='json')
        force_authenticate(request, user=self.user, token=self.user.auth_token)
        view = BulletinViewSet.as_view(actions={'post': 'create'})
        
        response = view(request)
        self.assertEqual(response.status_code, 403)
