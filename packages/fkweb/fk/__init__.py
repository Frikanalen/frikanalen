# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.db.backends.signals import connection_created


def sqlite_workaround(sender, connection, **kwargs):
    """Enable integrity constraint with sqlite."""
    if connection.vendor == "sqlite":
        cursor = connection.cursor()
        cursor.execute("PRAGMA legacy_alter_table = ON;")


connection_created.connect(sqlite_workaround)
