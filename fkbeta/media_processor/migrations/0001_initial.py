# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('parameters', models.CharField(default='', max_length=4096, blank=True)),
                ('result', models.CharField(default='', max_length=4096, blank=True)),
                ('status', models.IntegerField(default=0, choices=[(0, 'Not set'), (1, 'Pending'), (2, 'Running'), (3, 'Complete'), (4, 'Failed')])),
                ('source_file', models.ForeignKey(to='fk.VideoFile')),
                ('target_format', models.ForeignKey(to='fk.FileFormat')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
