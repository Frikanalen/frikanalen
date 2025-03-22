import datetime
import random
import re

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
            creator_id=1, organization_id=1,
            duration=datetime.timedelta(minutes=60),
            proper_import=True, is_filler=True)
        start_date = parse_to_datetime('2019-06-30 12:00')
        pre_count = Scheduleitem.objects.count()

        agenda_views.fill_agenda_with_jukebox(start_date, days=1)

        self.assertEquals(pre_count + 23, Scheduleitem.objects.count())

    def test_fills_in_only_where_it_can(self):
        Video.objects.create(
            name="video",
            creator_id=1, organization_id=1,
            duration=datetime.timedelta(minutes=60),
            proper_import=True, is_filler=True)
        start_date = parse_to_datetime('2019-06-30 12:00')
        Scheduleitem.objects.create(
            video_id=1,
            starttime=start_date - datetime.timedelta(minutes=10),
            duration=datetime.timedelta(minutes=1),
            schedulereason=Scheduleitem.REASON_AUTO,
        )
        Scheduleitem.objects.create(
            video_id=2,
            starttime=start_date + datetime.timedelta(hours=6, minutes=0),
            duration=datetime.timedelta(minutes=60),
            schedulereason=Scheduleitem.REASON_AUTO,
        )
        Scheduleitem.objects.create(
            video_id=1,
            starttime=start_date + datetime.timedelta(hours=24, minutes=10),
            duration=datetime.timedelta(minutes=1),
            schedulereason=Scheduleitem.REASON_AUTO,
        )
        pre_count = Scheduleitem.objects.count()

        agenda_views.fill_agenda_with_jukebox(start_date, days=0.5)

        self.assertEquals(pre_count + 9, Scheduleitem.objects.count())


class FillJukeboxUnitTests(TestCase):
    start_date = parse_to_datetime('2019-06-30 12:00')

    @classmethod
    def _video(cls, video_id=None, minutes=60, **kwargs):
        video_id = video_id or random.randint(0, 1000)
        if 'duration' not in kwargs:
            kwargs['duration'] = datetime.timedelta(minutes=minutes)
        return Video(
            id=video_id, name=f"id:${video_id}, min:{minutes}" % (
                video_id, minutes),
            creator_id=1, organization_id=1,
            proper_import=True, is_filler=True,
            **kwargs)

    def test_two_videos_fills_time(self):
        videos = [
            self._video(video_id=1, minutes=2),
            self._video(video_id=2, minutes=3),
        ]

        end = self.start_date + datetime.timedelta(minutes=15)

        res = agenda_views._items_for_gap(self.start_date, end, videos)

        self.assertEquals(
            [1, 2, 1, 2],
            [r['id'] for r in res])

    def test_times_are_rounded(self):
        """
        This test starts at 12:00:13, and there is a scheduled entry at 12:02:27.
        That means it'll try to fit something inside 12:01:00 to 12:02:00.
        It should find video 3 which is under 1 min.
        """
        self.skipTest("This test is not updated to match schedule code")
        videos = [
            self._video(video_id=1, duration=datetime.timedelta(
                minutes=1, seconds=1)),
            self._video(video_id=2, duration=datetime.timedelta(hours=1)),
            self._video(video_id=3, duration=datetime.timedelta(
                minutes=0, seconds=50)),
        ]
        Scheduleitem.objects.create(
            video_id=0,  # unused
            starttime=self.start_date +
            datetime.timedelta(minutes=2, seconds=27),
            duration=datetime.timedelta(minutes=1),
            schedulereason=Scheduleitem.REASON_AUTO,
        ),
        start = self.start_date + datetime.timedelta(seconds=13)
        end = self.start_date + datetime.timedelta(minutes=10, seconds=3)

        res = agenda_views._items_for_gap(start, end, videos)

        self.assertEquals(
            [3, 1, 1, 3, 3],
            [r['id'] for r in res])
        self.assertEquals(
            self.start_date + datetime.timedelta(minutes=1),
            res[0]['starttime'])

    def test_cases(self):
        self.skipTest("This test is skipped because code has changed")
        # video: fillers that exist and their order, <id>:<length_in_min>m
        # sched: existing, 2m means 2 unused minutes, x means 1m scheduled thing
        tc = [  # name     video            sched                expect
            ("fill in",  "1:1m",           "2m x 1m",           "1 1 x 1"),
            ("double",   "1:2m 2:1m",      "4m x 2m",           "1 2 2 x 1"),
            ("carry over", "1:2m 2:1m",    "1m x 1m x 2m",      "2 x 2 x 1"),
            ("no sort",  "2:2m 1:1m 4:3m 3:1m", "8m",           "2 1 4 3 1"),
            ("never fit", "1:1m 2:4m",     "4m",                "1 1 1 1"),
            ("order",    "1:2m 2:1m 3:1m", "2m x 1m x 1m x 1m", "1 x 2 x 3 x 2"),
            ("last fit", "1:2m 2:2m 3:1m", "2m x 1m x 1m x 5m", "1 x 3 x 3 x 2 1 3"),
            ("last fit 2", "3:3m 2:2m 4:4m 1:1m",
             "1m x 2m x 3m x 7m", "1 x 2 x 3 x 4 3"),
            ("tight sched", "2:2m 1:1m", "1m x x x 3m", "1 x x x 2 1"),
            ("tight sched", "2:2m", "x 1m x 1m x", "x x x"),
        ]
        for name, video_str, sched_str, expect_str in tc:
            video_tok = [
                re.match(r'(?P<id>\d):(?P<min>\d)m', x)
                for x in video_str.split(' ')
            ]
            videos = [
                self._video(video_id=int(m.group('id')),
                            min=int(m.group('min')))
                for m in video_tok
            ]

            sched_tok = [
                re.match(r'((?P<existing>x)|((?P<dur>\d)m))', x)
                for x in sched_str.split(' ')
            ]
            sched_cur = 0
            for sched in sched_tok:
                existing, dur = sched.group('existing'), sched.group('dur')
                if existing:
                    dur = 1
                    pre_scheduled.append(Scheduleitem(
                        video_id='x',
                        starttime=self.start_date +
                        datetime.timedelta(minutes=sched_cur),
                        duration=datetime.timedelta(minutes=int(dur)),
                    ))
                sched_cur += int(dur)
            end = self.start_date + datetime.timedelta(minutes=sched_cur)

            res = agenda_views._items_for_gap(self.start_date, end, videos)

            full_sched = pre_scheduled + [
                Scheduleitem(
                    video_id=r['id'],
                    starttime=r['starttime'],
                    duration=r['video'].duration)
                for r in res]
            full_sched.sort(key=lambda x: x.starttime)
            newly_scheduled_str = ' '.join(str(r.video_id) for r in full_sched)

            with self.subTest(name=name, videos=video_str, scheds=sched_str, dur=sched_cur):
                self.assertEquals(
                    expect_str,
                    newly_scheduled_str)
