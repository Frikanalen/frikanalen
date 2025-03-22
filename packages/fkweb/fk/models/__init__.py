# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
"""
Models for the Frikanalen database.

A lot of the models are business-specific for Frikanalen. There's also a
quite a few fields that are related to our legacy systems, but these are
likely to be removed when we're confident that data is properly
transferred.

An empty database should populate at least FileFormat and Categories with
some content before it can be properly used.

Fields that are commented out are suggestions for future fields. If they
turn out to be silly they should obviously be removed.
"""

from .assets import *
from .videos import *
from .users import *
from .schedule import *
from .members import *
