"""Copyright (c) 2008 Texas A&M University

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

from twisted.python import reflect
from twisted.internet import defer

from twistedschedule.interfaces import ISchedule



class ScheduledCall:
    """Call a function repeatedly.

    If C{f} returns a deferred, rescheduling will not take place until the
    deferred has fired. The result value is ignored.

    @ivar f: The function to call.
    @ivar a: A tuple of arguments to pass the function.
    @ivar kw: A dictionary of keyword arguments to pass to the function.
    @ivar clock: A provider of
        L{twisted.internet.interfaces.IReactorTime}.  The default is
        L{twisted.internet.reactor}. Feel free to set this to
        something else, but it probably ought to be set *before*
        calling L{start}.

    @type _lastTime: C{float}
    @ivar _lastTime: The time at which this instance most recently scheduled
        itself to run.
    """

    call = None
    running = False
    deferred = None
    schedule = None
    _lastTime = 0.0
    starttime = None

    def __init__(self, f, *a, **kw):
        self.f = f
        self.a = a
        self.kw = kw
        from twisted.internet import reactor
        self.clock = reactor


    def start(self, schedule):
        """Start running function based on the provided schedule.

        @param schedule: An object that provides or can be adapted to an
        ISchedule interface.


        @return: A Deferred whose callback will be invoked with
        C{self} when C{self.stop} is called, or whose errback will be
        invoked when the function raises an exception or returned a
        deferred that has its errback invoked.
        """
        assert not self.running, ("Tried to start an already running "
                                  "Scheduled.")
        
        self.schedule = ISchedule(schedule)
        
        self.running = True
        d = self.deferred = defer.Deferred()
        self.starttime = self.clock.seconds()
        self._lastTime = None
        
        self._reschedule()

        return d

    def stop(self):
        """Stop running function.
        """
        assert self.running, ("Tried to stop a ScheduledCall that was "
                              "not running.")
        self.running = False
        if self.call is not None:
            self.call.cancel()
            self.call = None
            d, self.deferred = self.deferred, None
            d.callback(self)

    def __call__(self):
        def cb(result):
            if self.running:
                self._reschedule()
            else:
                d, self.deferred = self.deferred, None
                d.callback(self)

        def eb(failure):
            self.running = False
            d, self.deferred = self.deferred, None
            d.errback(failure)

        self.call = None
        d = defer.maybeDeferred(self.f, *self.a, **self.kw)
        d.addCallback(cb)
        d.addErrback(eb)


    def _reschedule(self):
        """
        Schedule the next iteration of this scheduled call.
        """
        if self.call is None:
            delay = self.schedule.getDelayForNext()
            self._lastTime = self.clock.seconds() + delay
            self.call = self.clock.callLater(delay, self)


    def __repr__(self):
        if hasattr(self.f, 'func_name'):
            func = self.f.func_name
            if hasattr(self.f, 'im_class'):
                func = self.f.im_class.__name__ + '.' + func
        else:
            func = reflect.safe_repr(self.f)

        return 'ScheduledCall<%s>(%s, *%s, **%s)' % (
            self.schedule, func, reflect.safe_repr(self.a),
            reflect.safe_repr(self.kw))