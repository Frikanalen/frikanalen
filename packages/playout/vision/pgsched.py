import datetime
import pickle
import os
from twisted.python import log
from twisted.enterprise import adbapi
#import twistedpg
from . import lookup
from .configuration import configuration

#dbpool = adbapi.ConnectionPool("twistedpg", "host=borch.frikanalen.no port=5433 user=postgres password=SECRET dbname=frikanalen") # fyll inn!

def date_to_cache_filename(date):
    """Return a schedule-pickle filename based on a datetime

    Not tested"""
    return lookup.cache_path(os.path.join(configuration.schedule_cache_root,"plan%4i%02i%02i.pickle" % (date.year, date.month, date.day)))

def get_schedule_by_date(date):
    """Fetch schedule from picklecache by date

    Not tested (properly)"""
    fn = date_to_cache_filename(date)
    try:
        f = open(fn, "rb")
    except IOError:
        return None
    l = pickle.load(f)
    f.close()
    return l

if __name__=="__main__":
    from twisted.internet import reactor
    import pprint
    date = datetime.date.today()
    #date = datetime.date(year=2011, month=1, day=1)
    cache_schedule(date, 14).addCallback(lambda x: pprint.pprint(get_schedule_by_date(date)[0])).addCallback(lambda x: reactor.stop())
    reactor.run()
    #print date_to_cache_filename(datetime.date.today())
