# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from durationfield.db.models.fields.duration import DurationField


def duration_millisecond_to_microsecond(apps, schema_editor):
    for modelname in ['Scheduleitem', 'Video', 'WeeklySlot']:
        Model = apps.get_model('fk', modelname)
        for item in Model.objects.all():
            # Old duration used milliseconds, new one uses microseconds
            item.duration = item.duration * 1000
            item.save()


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0003_asrun'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scheduleitem',
            name='duration',
            field=DurationField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='video',
            name='duration',
            field=DurationField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='weeklyslot',
            name='duration',
            field=DurationField(),
            preserve_default=True,
        ),
        migrations.RunPython(duration_millisecond_to_microsecond),
    ]
