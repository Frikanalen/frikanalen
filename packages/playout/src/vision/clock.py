import datetime
#timemachine_delta = datetime.datetime.now().replace(hour=11,minute=24,second=30)-datetime.datetime.now()
#timemachine_delta = datetime.timedelta(hours=-2)
test_time = datetime.datetime(year=2011, month=7, day=19, hour=12, minute=10, second=0)
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=12, minute=28, second=50) # Between two programs
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=17, minute=28, second=50) # End of day
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=14, minute=28, second=50) # middle day
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=11, minute=59, second=15) # 45 sec before broadcast
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=11, minute=59, second=45) # 15 sec before broadcast
#test_time = datetime.datetime(year=2011, month=7, day=19, hour=11, minute=57, second=0) # Three minutes before broadcast
import time

class RealTime(object):
    def now(self):
        return datetime.datetime.now()+timemachine_delta

class ManualTime(object):
    def __init__(self, time=test_time):
        self.manual_time = time

    def now(self):
        return self.manual_time+timemachine_delta

    def advance(self, timedelta):
        self.manual_time += timedelta

class SimulatedTime(object):
    def __init__(self, time=test_time, ratio=0.0):
        self.simulated_time = time
        self.ratio = ratio
        self.start()

    def set_ratio(self, ratio):
        self.simulated_time = self.now()
        self.ratio = ratio
        self.start()

    def start(self):
        self.start_time = time.time()

    def now(self):
        return datetime.timedelta(seconds=(time.time()-self.start_time)*self.ratio)+self.simulated_time#+timemachine_delta

    def advance(self, timedelta):
        self.simulated_time += timedelta


source = None
now = None

def set(new_source):
    global source, now
    source = new_source
    now = source.now

def reset():
    set(RealTime())

#timemachine_delta = datetime.timedelta(days=-7*6)
timemachine_delta = datetime.timedelta()
reset()
#set(SimulatedTime(test_time, ratio=1.0))
#set(SimulatedTime(now(), ratio=1.0))

if __name__=="__main__":
    print(("delta", timemachine_delta))
    print(("clock.now():", now()))
    timemachine_delta = datetime.timedelta()
    #print "modified", now()
    reset()
    print(("reset", now()))

