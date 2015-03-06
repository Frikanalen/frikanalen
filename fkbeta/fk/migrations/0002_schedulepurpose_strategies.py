# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedulepurpose',
            name='strategy',
            field=models.CharField(
                default='latest', max_length=32,
                choices=[(b'latest', b'latest'),
                         (b'random', b'random'),
                         (b'least_scheduled', b'least_scheduled')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='schedulepurpose',
            name='type',
            field=models.CharField(
                default='videos', max_length=32,
                choices=[(b'videos', b'videos'),
                         (b'organization', b'organization')]),
            preserve_default=False,
        ),
    ]
