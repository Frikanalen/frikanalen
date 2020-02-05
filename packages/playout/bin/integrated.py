import logging
import os
import sys
from logging import handlers

sys.path.append(os.path.dirname(__file__) + '/../src/')
sys.path.append(os.path.dirname(__file__) + '/../lib/')

from vision import playlist
from vision import playout
from vision import playoutweb
from vision.configuration import configuration


def sanity_test():
    # TODO: Create a proper sanity test
    if not os.path.isdir("cache/dailyplan"):
        print("The directory 'cache/dailyplan' has to exist in work directory")
        sys.exit(1)
    if not os.path.isdir("cache/logs"):
        print("The directory 'cache/logs' has to exist in work directory")
        sys.exit(1)
    """
    # Not needed yet
    if not os.path.isdir("cache/screenshots"):
        print "The directory 'cache/screenshots' has to exist in work directory"
        sys.exit(1)
    if not os.path.isdir("cache/overlays"):
        print "The directory 'cache/screenhots' has to exist in work directory"
        sys.exit(1)
    """


def logging_excepthook(type, value, tb):
    "Exception handler that logs"
    logging.debug("Unhandled exception", exc_info=(type, value, tb))
    # continue processing the exception
    sys.__excepthook__(type, value, tb)


def setup_logging():
    log_fmt = ("%(asctime)s %(levelname)s:%(name)s "
               "%(filename)s:%(lineno)d %(message)s")
    logging.basicConfig(level=logging.DEBUG, format=log_fmt)
    logger = logging.getLogger()
    #ch = logging.StreamHandler()
    #ch.setLevel(logging.DEBUG)
    handler = handlers.TimedRotatingFileHandler(
        "cache/logs/integrated_playout.log", when="D")
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(logging.Formatter(log_fmt))
    logger.addHandler(handler)
    sys.excepthook = logging_excepthook


if __name__ == "__main__":
    sanity_test()
    setup_logging()
    logging.info("FK Integrated Playout started")
    logging.info("Configuration details:\n%s" % configuration.config_strings())

    # Create today's schedule
    schedule = playlist.Schedule()
    schedule.update_from_pg_cache(days=14)
    # Start the player
    playout_service = playout.PlayoutService()
    playout = playout.Playout(service=playout_service)

    # Start Web
    playoutweb.start_web(None, playout_service, playout, schedule=schedule)

    # Setting the schedule starts playback
    playout.set_schedule(schedule)

    # Heat up the reactor
    from twisted.internet import reactor
    reactor.run()
