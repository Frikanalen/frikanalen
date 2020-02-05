from twisted.internet import interfaces, task, reactor, defer, error
from twisted.trial import unittest

from vision import clock
import time
import datetime

test_time = datetime.datetime(year=2011, month=7, day=19, hour=12,
                              minute=10, second=0)


class ClockTestCase(unittest.TestCase):
    """
    Tests for L{twistedschedule.task.ScheduledCall} based on a fake
    L{IReactorTime} implementation.
    """
    def testRealtime(self):
        clock.set(clock.RealTime())
        self.assertNotEquals(clock.now(), test_time)

        a = clock.now()
        time.sleep(0.1)
        b = clock.now()
        d = b-a
        self.assertTrue(d.microseconds < 200000,
                        "Not equal, delta should be 100000-200000: delta = %f"
                        % (d.microseconds))

    def testSimulatedTime(self):
        source = clock.SimulatedTime(test_time, ratio=0.0)
        clock.set(source)
        self.assertEquals(clock.now(), test_time)
        a = clock.now()
        time.sleep(0.1)
        b = clock.now()
        d = b-a
        self.assertEquals(d.microseconds, 0)
        source.advance(datetime.timedelta(seconds=5))
        self.assertEquals(clock.now().second, 5)

        source.set_ratio(100.0)
        time.sleep(0.125)
        self.assertAlmostEqual(clock.now().second + clock.now().microsecond / 1e6, 17.5, places=0)

    def testManualTime(self):
        source = clock.ManualTime(test_time)
        clock.set(source)
        self.assertEquals(clock.now(), test_time)
        a = clock.now()
        time.sleep(0.1)
        b = clock.now()
        d = b-a
        self.assertEquals(d.microseconds, 0)
        source.advance(datetime.timedelta(seconds=5))
        self.assertEquals(clock.now().second, 5)

    def testReset(self):
        source = clock.SimulatedTime(test_time, ratio=0.0)
        clock.set(source)
        self.assertEquals(clock.now(), test_time)
        clock.reset()
        self.assertNotEquals(clock.now(), test_time)

        a = clock.now()
        time.sleep(0.1)
        b = clock.now()
        d = b-a
        self.assertTrue(d.microseconds < 200000, "Not equal, delta should be 100000-200000: delta = %f" % (d.microseconds))
