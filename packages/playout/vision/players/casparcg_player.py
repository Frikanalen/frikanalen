"""
Connect to TCP port 5250 on CasparCG server and instruct it to play
video.

Protocol http://casparcg.com/wiki/CasparCG_2.1_AMCP_Protocol

We use layers 10 for the fallback screen, 50 for the video playout and
100 for the logo in the corner.

"""

import logging
import os
from pathlib import Path
from vision.players.base_player import BasePlayer
from pycaspar import CasparCG
from ..configuration import configuration

MEDIA_LAYER = 50
BUG_LAYER = 100

class CasparCGPlayer(BasePlayer):
    def __init__(self, loop_filename):
        self.caspar = CasparCG('tx2')
        self.channel = self.caspar.channel(1)
        self.media_layer = self.channel.layer(MEDIA_LAYER)
        self.channel.clear()
        watermarkimage = 'stills/screenbug'
        self._play_file(watermarkimage, layer=self.channel.layer(BUG_LAYER), loop=True)

    def _play_file(self, filename, resume_offset=0, layer=None, loop=False):
        if layer is None:
            layer = self.media_layer

        if filename is not None:
            logging.debug('CasparCG is being asked to play filename %s', filename)

            if '/mnt/media' in filename:
                filename = '%s' % (Path(filename).relative_to(configuration.media_root),)

            if resume_offset != 0:
                seek = int(resume_offset * self.channel.framerate)
            else:
                seek = 0

            if True: # os.path.exists(filename):
                assetname = os.path.splitext(filename)[0]
                try:
                    # FIXME filename should be escaped, ie using \" \\, etc.
                    layer.play(
                            filename = assetname,
                            transition = 'MIX 50 1 LINEAR RIGHT',
                            loop = loop,
                            seek = seek)
                except:
                    layer.clear()
                    logging.error("Failed to play file: %s" % filename)
                    raise
            else:
                layer.clear()
                logging.error(
                    "Didn't find file. Playback never started: %s" % filename)
        else:
            layer.clear()

    def play_program(self, program=None, resume_offset=0):
        filename = None
        loop = False
        if program is not None:
            filename = program.get_filename()
            loop = program.loop
        self._play_file(filename, resume_offset, self.media_layer, loop)

    def show_still(self, filename):
        resume_offset = 0
        self._play_file(filename, resume_offset, self.media_layer)

    def pause_screen(self):
        # FIXME todo
        pass

    def seconds_until_end_of_playing_video(self):
        """
        INFO 1-10
        201 INFO OK
        <?xml version="1.0" encoding="utf-8"?>
        <layer>
           <auto_delta>null</auto_delta>
           <frame-number>2230399</frame-number>
           <nb_frames>268</nb_frames>
           <frames-left>4292737165</frames-left>
           <frame-age>81</frame-age>
           <foreground>
              <producer>
                 <type>ffmpeg-producer</type>
                 <filename>media/AMB.mp4</filename>
                 <width>1920</width>
                 <height>1080</height>
                 <progressive>true</progressive>
                 <fps>25</fps>
                 <loop>false</loop>
                 <frame-number>2230399</frame-number>
                 <nb-frames>268</nb-frames>
                 <file-frame-number>268</file-frame-number>
                 <file-nb-frames>268</file-nb-frames>
              </producer>
           </foreground>
           <background>
              <producer>
                 <type>empty-producer</type>
              </producer>
           </background>
           <index>10</index>
        </layer>
        """
        #(code, response) = self._send_command("INFO %d-%d" % (self.channel, self.layer),
        #                                      xmlreply = True)
        # xml = lxml...(response)
        # layer/frame-number?
        # FIXME todo
        logging.debug("unable to figure out time to next end")
        return -1
