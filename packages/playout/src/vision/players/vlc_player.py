import logging
import os

import vlc
from twisted.internet import reactor

from vision.players.base_player import BasePlayer


class VLCPlayer(BasePlayer):
    def __init__(self, loop_filename):
        self.inst = vlc.Instance(
            '--aout=alsa --sub-filter=logo --no-video-title-show --snapshot-format=jpg ' \
            #'--monitor-par=1:1 --aspect-ratio=5:4 ' \
            #' --vout=opengl ' + \
            ' --no-osd --no-snapshot-preview ' \
            #' -vvv ' \
            #" --sout #transcode{vcodec=mp4v,acodec=mpga,vb=400,ab=128}:standard{access=http,mux=ogg,dst=localhost:8011}"
            ) #--sub-filter=marq
        self.player = self.inst.media_player_new()
        #self.player.set_fullscreen(True) # Must not be true for Groth
        self.player.video_set_deinterlace("disabled\0")
        self.mlp = self.inst.media_list_player_new()
        self.mlp.set_media_player(self.player)
        self.loop = self.inst.media_new(loop_filename)
        self.overlay_call = None
        self.state = None
        # TODO: Fix vlc-events. Doesn't work under Linux.
        #       Not threadsafe? ABI-mismatch?
        #self.player.event_manager().event_attach(
        #    vlc.EventType.MediaPlayerPlaying, self._addNewPlaceholder)
        #self.player.event_manager().event_attach(
        #    vlc.EventType.MediaPlayerEncounteredError, self._error)

        self.pause_screen()
        reactor.callLater(1.0, self._force_aspectratio, None)

    def _error(self, foo):
        logging.critical("libvlc event: MediaPlayerEncounteredError - Playback probably stopped and screen black.")

    def _addNewPlaceholder(self, foo):
        logging.debug("libvlc event: Playback started.")
        self.ml.add_media(self.placeholder)

    def _force_aspectratio(self, foo):
        self.player.video_set_aspect_ratio("5:4")
        reactor.callLater(1.0, self._force_aspectratio, None)

    def _swap_overlay(self):
        # Rotate overlays
        """
        overlays = ["stills/sendeplan-a.png", "stills/sendeplan-b.png"]
        fn = overlays[self.overlay_n % len(overlays)]
        self.overlay_n += 1
        self.player.video_set_logo_string(vlc.VideoLogoOption.file, fn)
        self.player.video_set_logo_int(vlc.VideoLogoOption.delay, 0)
        self.overlay_call = reactor.callLater(4.0, self._swap_overlay)
        """
        pass

    def play_program(self, program=None, resume_offset=0):
        self.still = None
        ml = self.inst.media_list_new()
        if program is not None:
            self.player.video_set_logo_int(vlc.VideoLogoOption.delay, 0)
            self.player.video_set_logo_string(vlc.VideoLogoOption.file, "stills/screenbug.png")
            self.state = "video"
            # TODO: Fallback if the folder is empty
            media_path = program.get_filename()
            if os.path.exists(media_path):
                media = self.inst.media_new(media_path)
                ml.add_media(media)
                # Kill overlays
                if self.overlay_call:
                    self.overlay_call.cancel()
                    self.overlay_call = None
            else:
                logging.error("Didn't find file. Playback never started: %s" % media_path)
        else:
            # Reset & show overlays
            self._swap_overlay()
            self.state = "pase"

        # Add background for pauses
        for n in range(6000):
        #for n in range(2):
            ml.add_media(self.loop)
        self.ml = ml

        self.mlp.set_media_player(self.player)
        self.mlp.pause() # This causes a bit less flashing when changing media
        self.mlp.set_media_list(ml)
        self.mlp.play_item_at_index(0)
        # Handle playback and resume offset
        offset = resume_offset
        if program and program.playback_offset:
            offset += program.playback_offset
        if offset:
            self.player.set_time(int(offset*1000))

    def show_still(self, filename):
        picture = self.inst.media_new(filename)
        ml = self.inst.media_list_new()
        ml.add_media(picture)
        self.mlp.pause() # This causes a bit less flashing when changing media
        self.mlp.set_media_list(ml)
        self.mlp.play_item_at_index(0)
        self.state = "still"

    def pause_screen(self):
        self.overlay_n = 0
        self.play_program()

    def seconds_until_end_of_playing_video(self):
        return (self.player.get_length()-self.player.get_time()) / 1000.

    def snapshot(self):
        # TODO: Change all instances of cache/ to os.path.join(configuration....)
        filename = "cache/snapshots"
        res = self.player.video_take_snapshot(0, filename, 0, 0) # input, filename, width, height
        if res == 0:
            logging.info("Screenshot taken")
        else:
            logging.warning("Screenshot failed")
