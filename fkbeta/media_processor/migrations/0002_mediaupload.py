# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fk', '0004_msfield_to_durationfield'),
        ('media_processor', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MediaUpload',
            fields=[
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, verbose_name='created', editable=False)),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, verbose_name='modified', editable=False)),
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('filename', models.CharField(max_length=512)),
                ('size', models.IntegerField(default=0)),
                ('hash_sha256', models.IntegerField(default=0, blank=True)),
                ('last_write_at', models.DateTimeField(blank=True)),
                ('state', models.CharField(blank=True, max_length=256, choices=[('uploading', 'uploading'), ('upload_maybe_complete', 'upload_maybe_complete'), ('upload_complete', 'upload_complete'), ('deleted', 'deleted')])),
                ('nodename', models.CharField(max_length=256, null=True, blank=True)),
                ('target_video', models.ForeignKey(blank=True, to='fk.Video', null=True)),
                ('uploader', models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
