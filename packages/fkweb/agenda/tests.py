import datetime
import random
import re
import unittest

from django.test import TestCase
from django.utils import timezone

from fk.models import Scheduleitem
from fk.models import Video

from . import views as agenda_views


def parse_to_datetime(dt_str):
    dt = datetime.datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
    return timezone.make_aware(dt, timezone.get_current_timezone())


class FillJukeboxIntegrationTests(TestCase):
    fixtures = ['test.yaml']

    def test_fills_in(self):
        Video.objects.create(
            name="video",
            editor_id=1, organization_id=1,
            duration=datetime.timedelta(minutes=60),
            proper_import=True, is_filler=True)
        start_date = parse_to_datetime('2019-06-30 12:00')
        pre_count = Scheduleitem.objects.count()

        k = agenda_views.fill_agenda_with_jukebox(start_date, days=1)

        self.assertEquals(pre_count + 24, Scheduleitem.objects.count())


class FillJukeboxUnitTests(TestCase):
    start_date = parse_to_datetime('2019-06-30 12:00')

    @classmethod
    def _video(cls, vid=None, min=60):
        vid = vid or random.randint(0, 1000)
        return Video(
                id=vid, name="id:%d, min:%d" % (vid, min),
                editor_id=1, organization_id=1,
                duration=datetime.timedelta(minutes=min),
                proper_import=True, is_filler=True)

    @classmethod
    def _sched(cls, start_min, video_id=1, dur_min=60):
        return Scheduleitem(
            video_id=video_id,
            starttime=cls.start_date + datetime.timedelta(minutes=start_min),
            duration=datetime.timedelta(minutes=dur_min),
        )

    def test_one_video_fills_time(self):
        videos = [
            self._video(vid=1, min=2),
        ]
        pre_scheduled = []
        end = self.start_date + datetime.timedelta(minutes=10)

        res = agenda_views._fill_agenda_with_jukebox(
                self.start_date, end, pre_scheduled, videos)
        print ("get reso", res, "\n");

        self.assertEquals(
                [1, 1, 1, 1, 1],
                [r['id'] for r in res])

    def test_two_videos_fills_time(self):
        videos = [
            self._video(vid=1, min=2),
            self._video(vid=2, min=3),
        ]
        pre_scheduled = []
        end = self.start_date + datetime.timedelta(minutes=10)

        res = agenda_views._fill_agenda_with_jukebox(
                self.start_date, end, pre_scheduled, videos)
        print ("get reso", res, "\n");

        self.assertEquals(
                [1, 2, 1, 2],
                [r['id'] for r in res])

    def test_only_fills_available_time(self):
        videos = [
            self._video(vid=1, min=2),
            self._video(vid=2, min=5),
        ]
        pre_scheduled = []
        end = self.start_date + datetime.timedelta(minutes=12)

        res = agenda_views._fill_agenda_with_jukebox(
                self.start_date, end, pre_scheduled, videos)
        print ("get reso", res, "\n");

        self.assertEquals(
                [1, 2, 1, 1],
                [r['id'] for r in res])

    def test_only_fills_available_time_inside_pre_scheduled(self):
        videos = [
            self._video(vid=1, min=2),
        ]
        pre_scheduled = [
            self._sched(3, dur_min=2) # occupies 3 min to 5 min
        ]
        end = self.start_date + datetime.timedelta(minutes=7)

        res = agenda_views._fill_agenda_with_jukebox(
                self.start_date, end, pre_scheduled, videos)
        print ("get reso", res, "\n");

        self.assertEquals(
                [1, 1],
                [r['id'] for r in res])

    def test_cases(self):
        tc = [
            #("1:1m", "2m 9:1m 1m", "1 1 9 1"),
            ("1:2m 2:1m", "4m 9:1m 2m", "1 2 2 9 1"),
        ]
        for video_str, sched_str, expect_str in tc:
            video_tok = [
                re.match(r'(?P<id>\d):(?P<min>\d)m', x)
                for x in video_str.split(' ')
            ]
            videos = [
                self._video(vid=int(m.group('id')), min=int(m.group('min')))
                for m in video_tok
            ]

            sched_tok = [
                re.match('((?P<video_id>\d):)?(?P<dur>\d)m', x)
                for x in sched_str.split(' ')
            ]
            sched_cur = 0
            pre_scheduled = []
            for sched in sched_tok:
                video_id, dur = sched.group('video_id'), sched.group('dur')
                if video_id:
                    pre_scheduled.append(
                        self._sched(sched_cur, dur_min=int(dur), video_id=video_id))
                sched_cur += int(dur)
            end = self.start_date + datetime.timedelta(minutes=sched_cur)

            res = agenda_views._fill_agenda_with_jukebox(
                    self.start_date, end, pre_scheduled, videos)
            print ("get reso", res, "\n");

            full_sched = pre_scheduled + [
                Scheduleitem(
                    video_id=r['id'],
                    starttime=r['starttime'],
                    duration=r['video'].duration)
                for r in res]
            full_sched.sort(key=lambda x: x.starttime)
            newly_scheduled_str = ' '.join(str(r.video_id) for r in full_sched)

            self.assertEquals(
                    expect_str,
                    newly_scheduled_str)
