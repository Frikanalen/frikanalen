#!/usr/bin/env python3
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import os
import sys

if __name__ == "__main__":
    local = "fkbeta.settings.local"
    test = "fkbeta.settings.test"
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", test if 'test' in sys.argv else local)

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
