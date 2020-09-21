#!/usr/bin/env python3
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import io

class Poster():
    def __init__(self, fields):
        self.heading_font = ImageFont.truetype('./Roboto-Black.ttf', 72)
        self.body_font = ImageFont.truetype('./Roboto-Black.ttf', 52)
        self.heading = fields['heading']
        self.text = fields['text']
        self.poster = Image.open('background.png')
        self.width, self.height = (1280, 720)

    def render(self):
        draw = ImageDraw.Draw(self.poster)

        draw.multiline_text((142, 180), self.heading, font=self.heading_font, fill='#d66969')
        draw.multiline_text((195, 300), self.text, font=self.body_font, fill='#78bddb')

    def _export(self, format):
        self.render()
        buf = io.BytesIO()
        self.poster.save(buf, format)
        return buf.getvalue()

    def getPNG(self):
        return self._export('PNG')

    def getRGBA(self):
        self.render()
        return self.poster.tobytes()
