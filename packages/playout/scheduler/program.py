# TODO: Need a Program that represents a generic program on disk w/o being scheduled
# TODO: Program that represents the following: jukebox, dead air, pause, program guide, ident

from database import Video
from . import clock
from vision.configuration import configuration

class Program(object):
    """
    program_start
        datetime
    media_id
        integer
    playback_offset
        None or float in seconds
    playback_duration
        None or float in seconds

    TODO: perhaps specify a "pase" media_id or somethign?
    """
    def __init__(self):
        self.media_id = None
        self.program_start = None
        self.playback_offset = None
        self.playback_duration = None
        self.title="N/A"
        self.data = {}
        self.loop = False

    def set_program(self, media_id, program_start=None, playback_offset=None, playback_duration=None, title="N/A", data={}, filename=None, loop=False):
        self.program_start = program_start
        self.media_id = media_id
        self.playback_offset = playback_offset
        self.playback_duration = playback_duration
        self.title = title
        self.data=data
        self.filename = filename
        self.loop = loop

    def get_filename(self):
        print("Getting for {}, filename = {}".format(self.media_id, self.filename))
        if self.filename is not None:
            return self.filename

        if configuration.mediaAssets.scheme == 'https':
            video = Video(self.media_id).files['theora']
            video = configuration.mediaAssets.baseURL + video
        else:
            video = Video(self.media_id).files['broadcast']
            if video is None:
                video = Video(self.media_id).files['original']

        print("File is {}".format(video))
        return video

    def seconds_since_playback(self):
        dt = (clock.now() - self.program_start)
        return dt.seconds + dt.microseconds / 1e6

    def seconds_until_playback(self):
        dt = (self.program_start - clock.now())
        return dt.seconds + dt.microseconds / 1e6

    def seconds_until_end(self):
        duration = self.playback_duration
        if not duration:
            duration = self.get(duration)
        if not duration:
            raise Exception("No duration given for video %i" % self.media_id)
        dt = (self.program_start - clock.now())
        return dt.seconds + dt.microseconds / 1e6 + duration

    def __repr__(self):
        return "<Program #%i %r>" % (self.media_id, self.title)

    # Idiotic marshalling...
    def from_dict(self, d):
        # Tue Jul 19 12:30:00 2011
        fmt = "%a %b %d %H:%M:%S %Y"
        self.program_start = strptime(d["program_start"], fmt)
        self.media_id = d["media_id"]
        self.playback_offset = d["playback_offset"]
        self.playback_duration = d["playback_duration"]
        self.title = d["title"]

    def to_dict(self):
        end = None
        duration = self.playback_duration
        if duration == float("inf"):
            end = "inf"
            duration = "inf"
        elif duration:
            end = (self.program_start+datetime.timedelta(seconds=self.playback_duration)).isoformat()
        d = {
          "media_id": self.media_id,
          "program_start": self.program_start and self.program_start.isoformat(),
          "program_end": end,
          "playback_offset": self.playback_offset,
          "playback_duration": duration,
          "title": self.title
          }
        return d

    def json(self):
        d = self.to_dict()
        return json.dumps(d).encode('utf-8')
