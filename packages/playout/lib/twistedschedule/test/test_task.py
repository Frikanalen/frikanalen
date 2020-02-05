# Copyright (c) 2001-2007 Twisted Matrix Laboratories.
# See LICENSE for details.

import zope.interface

from twisted.python.compat import set

from twisted.trial import unittest

from twisted.internet import interfaces, task, reactor, defer, error

# Be compatible with any jerks who used our private stuff
Clock = task.Clock

from twisted.python import failure

from twistedschedule.task import ScheduledCall
from twistedschedule.interfaces import ISchedule



class TestableScheduledCall(ScheduledCall):
    def __init__(self, clock, *a, **kw):
        ScheduledCall.__init__(self,*a, **kw)
        self.clock = clock

class SimpleSchedule(object):
    zope.interface.implements(ISchedule)
    
    def __init__(self,delay=1):
        self._delay = delay
    
    def getDelayForNext(self):
        return self._delay

class TestException(Exception):
    pass

class ScheduledCallTestCase(unittest.TestCase):
    """
    Tests for L{twistedschedule.task.ScheduledCall} based on a fake L{IReactorTime}
    implementation.
    """
    def testDefaultClock(self):
        """
        L{LoopingCall}'s default clock should be the reactor.
        """
        call = ScheduledCall(lambda: None)
        self.assertEqual(call.clock, reactor)

    def testBasicFunction(self):
        # Arrange to have time advanced enough so that our function is
        # called a few times.
        # Only need to go to 2.5 to get 3 calls, since the first call
        # happens before any time has elapsed.
        timings = [0.1, 0.05, 0.1, 0.1]

        clock = task.Clock()

        L = []
        def foo(a, b, c=None, d=None):
            L.append((a, b, c, d))

        sc = TestableScheduledCall(clock, foo, "a", "b", d="d")
        D = sc.start(SimpleSchedule(0.1))

        theResult = []
        def saveResult(result):
            theResult.append(result)
        D.addCallback(saveResult)

        clock.pump(timings)

        self.assertEquals(len(L), 3,
                          "got %d iterations, not 3" % (len(L),))

        for (a, b, c, d) in L:
            self.assertEquals(a, "a")
            self.assertEquals(b, "b")
            self.assertEquals(c, None)
            self.assertEquals(d, "d")

        sc.stop()
        self.assertIdentical(theResult[0], sc)

        # Make sure it isn't planning to do anything further.
        self.failIf(clock.calls)


    def testDelayedStart(self):
        timings = [0.05, 0.1, 0.1]

        clock = task.Clock()

        L = []
        sc = TestableScheduledCall(clock, L.append, None)
        d = sc.start(SimpleSchedule(0.1))

        theResult = []
        def saveResult(result):
            theResult.append(result)
        d.addCallback(saveResult)

        clock.pump(timings)

        self.assertEquals(len(L), 2,
                          "got %d iterations, not 2" % (len(L),))
        sc.stop()
        self.assertIdentical(theResult[0], sc)

        self.failIf(clock.calls)


    def testBadDelay(self):
        sc = ScheduledCall(lambda: None)
        self.assertRaises(TypeError, sc.start, -1)


    # Make sure that LoopingCall.stop() prevents any subsequent calls.
    def _stoppingTest(self, delay):
        ran = []
        def foo():
            ran.append(None)

        clock = task.Clock()
        sc = TestableScheduledCall(clock, foo)
        d = sc.start(SimpleSchedule(delay))
        sc.stop()
        self.failIf(ran)
        self.failIf(clock.calls)


    def testStopAtOnce(self):
        return self._stoppingTest(0)


    def testStoppingBeforeDelayedStart(self):
        return self._stoppingTest(10)



class ReactorLoopTestCase(unittest.TestCase):
    # Slightly inferior tests which exercise interactions with an actual
    # reactor.
    def testFailure(self):
        def foo(x):
            raise TestException(x)

        sc = ScheduledCall(foo, "bar")
        return self.assertFailure(sc.start(SimpleSchedule(0.1)), TestException)


    def testFailAndStop(self):
        def foo(x):
            sc.stop()
            raise TestException(x)

        sc = ScheduledCall(foo, "bar")
        return self.assertFailure(sc.start(SimpleSchedule(0.1)), TestException)


    def testStopAtOnceLater(self):
        # Ensure that even when LoopingCall.stop() is called from a
        # reactor callback, it still prevents any subsequent calls.
        d = defer.Deferred()
        def foo():
            d.errback(failure.DefaultException(
                "This task also should never get called."))
        self._sc = ScheduledCall(foo)
        self._sc.start(SimpleSchedule(1))
        reactor.callLater(0, self._callback_for_testStopAtOnceLater, d)
        return d


    def _callback_for_testStopAtOnceLater(self, d):
        self._sc.stop()
        reactor.callLater(0, d.callback, "success")

    def testWaitDeferred(self):
        # Tests if the callable isn't scheduled again before the returned
        # deferred has fired.
        timings = [0.2, 0.8]
        clock = task.Clock()

        def foo():
            d = defer.Deferred()
            d.addCallback(lambda _: sc.stop())
            clock.callLater(1, d.callback, None)
            return d

        sc = TestableScheduledCall(clock, foo)
        d = sc.start(SimpleSchedule(0.2))
        clock.advance(0.2)
        clock.pump(timings)
        self.failIf(clock.calls)

    def testFailurePropagation(self):
        # Tests if the failure of the errback of the deferred returned by the
        # callable is propagated to the sc errback.
        #
        # To make sure this test does not hang trial when LoopingCall does not
        # wait for the callable's deferred, it also checks there are no
        # calls in the clock's callLater queue.
        timings = [3]
        clock = task.Clock()

        def foo():
            d = defer.Deferred()
            clock.callLater(0.3, d.errback, TestException())
            return d

        sc = TestableScheduledCall(clock, foo)
        d = sc.start(SimpleSchedule(1))
        clock.pump(timings)
        self.assertFailure(d, TestException)

        clock.pump(timings)
        self.failIf(clock.calls)
        return d
