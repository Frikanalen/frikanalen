#!/usr/bin/env python3
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import io

class CharacterGenerator():
    def __init__(self):
        self.heading_font = ImageFont.truetype('./Roboto-Black.ttf', 72)
        self.body_font = ImageFont.truetype('./Roboto-Black.ttf', 52)

    def render(self, heading, text):
        width, height = (1280, 720)
        poster = Image.open('background.png')
        draw = ImageDraw.Draw(poster)

        draw.multiline_text((142, 180), heading, font=self.heading_font, fill='#d66969')
        draw.multiline_text((195, 300), text, font=self.body_font, fill='#78bddb')

        buf = io.BytesIO()
        poster.save(buf, 'PNG')
        return buf.getvalue()
