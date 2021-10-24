from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.test import APITestCase

from fk.models import Scheduleitem


class ScheduleitemTest(APITestCase):
    fixtures = ['test.yaml']

    def setUp(self):
        self.client.force_authenticate(
            get_user_model().objects.get(email='staff_user@fake.com'))

    def test_creating_new_scheduleitem(self):
        # Rest Framework now always sends back dates using configured TZ
        times = [
            ('2015-01-01T11:00:00Z', '2015-01-01T12:00:00+01:00'),
            ('2015-01-01T08:59:00Z', '2015-01-01T09:59:00+01:00'),
            ('2015-01-01T09:58:00+01:00', '2015-01-01T09:58:00+01:00'),
            ('2015-01-01T11:00:59Z', '2015-01-01T12:00:59+01:00'),
        ]
        for given_time, returned_time in times:
            r = self.client.post(reverse('api-scheduleitem-list'), {
                'video': 2,
                'starttime': given_time,
                'duration': '58.312',
                'schedulereason': Scheduleitem.REASON_LEGACY
            },
                                 format='json')
            self.assertEqual(status.HTTP_201_CREATED, r.status_code)
            self.assertEqual(returned_time, r.data['starttime'])
            self.assertEqual('00:00:58.312000', r.data['duration'])
            self.assertEqual(2, r.data['video'])

    def test_schedule_item_cant_overlap(self):
        times = [
            ('09:00:00.00: tech video', '2015-01-01T08:59:30Z'),
            ('09:00:00.00: tech video', '2015-01-01T09:59:59.999Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:00:00Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:30:00Z'),
            ('10:00:00.00: dummy video', '2015-01-01T10:59:59.9Z'),
        ]
        for conflict, starttime in times:
            r = self.client.post(reverse('api-scheduleitem-list'), {
                'video_id': '/api/videos/2',
                'starttime': starttime,
                'duration': '00:00:58.312',
                'schedulereason': Scheduleitem.REASON_LEGACY
            },
                                 format='json')
            self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)
            self.assertEqual("Conflict with '2015-01-01 %s'." % conflict,
                             r.data['duration'][0])

    def test_schedule_item_can_update(self):
        times = [
            (1, {
                'starttime': '2015-01-01T08:59:30Z'
            }),
            (1, {
                'starttime': '2015-01-01T09:50:00Z',
                'duration': '00:09:00'
            }),
            (2, {
                'starttime': '2015-01-01T10:00:00Z'
            }),
            (2, {
                'starttime': '2015-01-01T10:30:00Z'
            }),
            (2, {
                'starttime': '2015-01-01T10:59:59.900000Z'
            }),
        ]
        for schedule_pk, changes in times:
            changes.update({'schedulereason': Scheduleitem.REASON_LEGACY})
            r = self.client.patch(reverse('api-scheduleitem-detail',
                                          args=[schedule_pk]),
                                  changes,
                                  format='json')
            self.assertEqual(status.HTTP_200_OK, r.status_code)
            for k, v in list(changes.items()):
                if k == 'starttime':
                    p = parse_datetime(v)
                    pk = parse_datetime(r.data[k])
                    self.assertEqual(parse_datetime(v),
                                     parse_datetime(r.data[k]))
                else:
                    self.assertEqual(v, r.data[k])

    def test_schedule_item_update_can_not_override(self):
        times = [
            (1, {
                'duration': '1:10:00'
            }),
            (1, {
                'starttime': '2015-01-01T09:50:00Z'
            }),
            (2, {
                'starttime': '2015-01-01T09:50:00Z'
            }),
        ]
        for schedule_pk, changes in times:
            r = self.client.patch(reverse('api-scheduleitem-detail',
                                          args=[schedule_pk]),
                                  changes,
                                  format='json')
            self.assertEqual(status.HTTP_400_BAD_REQUEST, r.status_code)
