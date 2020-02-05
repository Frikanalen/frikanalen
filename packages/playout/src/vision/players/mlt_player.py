import os
import logging

import mlt

from vision.players.base_player import BasePlayer


class MLTPlayer(BasePlayer):
    consumer_type_ = 'sdl'

    def __init__(self, loop_filename):
        mlt.Factory().init( )
        self.profile = mlt.Profile( )
        self.mlt_consumer = mlt.Consumer(self.profile, self.consumer_type_)
        #self.mlt_consumer.set("fullscreen", 1)
        self.loop = mlt.Producer(self.profile, loop_filename)
        #self.loop.set("force_aspect_ratio", 1.0)
        self.loop.set("eof", "loop")
        #self.playing_consumer = None
        self.mlt_consumer.set( "rescale", "none" )
        #self.overlay_call = None
        self.state = None
        self.pause_screen()
        #self.mlt_consumer.listen("producer-changed", None, self.blah )
        self.mlt_consumer.start( )
        print(("MLT profile desc", self.profile.description()))
        print(("Framerate", self.profile.frame_rate_num()))
        print(("Width/Height/Progressive", self.profile.width(), self.profile.height(), self.profile.progressive()))

    def _error(self, foo):
        logging.critical("libvlc event: MediaPlayerEncounteredError - Playback probably stopped and screen black.")

    def _mlt_watermark(self, producer):
        filt = mlt.Filter(self.profile, 'watermark:/home/phed/Playout/stills/screenbug.png')
        filt.connect(producer)
        return filt

    def play_program(self, program=None, resume_offset=0):
        self.still = None
        producer = None
        if program is not None:
            #self.player.video_set_logo_int(vlc.VideoLogoOption.delay, 0)
            #self.player.video_set_logo_string(vlc.VideoLogoOption.file, "stills/screenbug.png")
            self.state = "video"
            # TODO: Fallback if the folder is empty
            media_path = program.get_filename()
            if os.path.exists(media_path):
                producer = mlt.Producer( self.profile, media_path )
                producer.set("force_aspect_ratio", 1.0)
                #producer.set("video_delay", "2.5")
                if program.loop:
                    producer.set("eof", "loop")
                watermarked = self._mlt_watermark(producer)
                self.mlt_consumer.connect(watermarked)
                #self.playing_producer = producer
                # Kill overlays
                #if self.overlay_call:
                #    self.overlay_call.cancel()
                #    self.overlay_call = None
            else:
                logging.error("Didn't find file. Playback never started: %s" % media_path)
        else:
            # Reset & show overlays
            #self._swap_overlay()
            #if not self.playing_consumer:
            watermarked = self._mlt_watermark(self.loop)
            self.mlt_consumer.connect(watermarked)
        # Handle playback and resume offset
        offset = resume_offset
        if program and program.playback_offset:
            offset += program.playback_offset
        if producer and offset:
            producer.seek(int(offset*25))

    def show_still(self, filename):
        producer = mlt.Producer( self.profile, filename )
        self.mlt_consumer.connect( producer )
        self.state = "still"

    def pause_screen(self):
        self.overlay_n = 0
        self.play_program()

    def seconds_until_end_of_playing_video(self):
        return (self.player.get_length()-self.player.get_time()) / 1000.


class MLTDecklinkPlayer(MLTPlayer):
    consumer_type_ = 'decklink'
