# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import durationfield.db.models.fields.duration
from django.db import models, migrations


def add_created_time(apps, schema_editor):
    Model = apps.get_model('fk', 'Video')
    for item in Model.objects.filter(created_time__isnull=True):
        alternatives = [
            item.uploaded_time,
            item.updated_time,
        ]
        try:
            item.created_time = min(a for a in alternatives if a)
        except ValueError:
            pass
        else:
            item.save(update_fields=['created_time'])


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0004_msfield_to_durationfield'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='created_time',
            field=models.DateTimeField(help_text=b'Time the program record was created', auto_now_add=True, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='video',
            name='duration',
            field=durationfield.db.models.fields.duration.DurationField(null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='video',
            name='updated_time',
            field=models.DateTimeField(help_text=b'Time the program record has been updated', auto_now=True, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='video',
            name='uploaded_time',
            field=models.DateTimeField(help_text=b'Time the original video for the program was uploaded', null=True, blank=True),
            preserve_default=True,
        ),
        migrations.RunPython(add_created_time, lambda a, b: None),
    ]
