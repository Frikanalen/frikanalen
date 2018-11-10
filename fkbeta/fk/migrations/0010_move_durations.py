# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import migrations


def noop(*args):
    return None

def forwards_duration_copy(apps, schema_editor):
    for model in ['Video', 'Scheduleitem', 'WeeklySlot']:
        Model = apps.get_model('fk', model)
        db_alias = schema_editor.connection.alias
        for m in Model.objects.using(db_alias).all():
            m.duration = m.duration_old or datetime.timedelta(0)
            m.save(update_fields=['duration'])


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0009_use_django_durationfield'),
    ]

    operations = [
        migrations.RunPython(
            forwards_duration_copy, noop
        ),
    ]
