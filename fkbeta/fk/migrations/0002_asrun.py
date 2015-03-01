# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AsRun',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('program_name', models.CharField(default=b'', max_length=160, blank=True)),
                ('playout', models.CharField(default=b'main', max_length=255, blank=True)),
                ('in_ms', models.IntegerField(default=0, blank=True)),
                ('out_ms', models.IntegerField(null=True, blank=True)),
                ('video', models.ForeignKey(blank=True, to='fk.Video', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
