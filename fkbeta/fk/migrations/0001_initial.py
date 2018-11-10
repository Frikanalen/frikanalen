# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import colorful.fields
import fk.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.IntegerField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('rgb', colorful.fields.RGBColorField()),
                ('desc', models.CharField(max_length=255, blank=True)),
            ],
            options={
                'db_table': 'Category',
                'verbose_name': 'video category',
                'verbose_name_plural': 'video categories',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='FileFormat',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('description', models.TextField(max_length=255, unique=True, null=True, blank=True)),
                ('fsname', models.CharField(max_length=20)),
                ('rgb', colorful.fields.RGBColorField(default=b'cccccc')),
            ],
            options={
                'db_table': 'ItemType',
                'verbose_name': 'video file format',
                'verbose_name_plural': 'video file formats',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=255, blank=True)),
                ('fkmember', models.BooleanField(default=False)),
                ('orgnr', models.CharField(max_length=255, blank=True)),
                ('members', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('name',),
                'db_table': 'Organization',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Scheduleitem',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('default_name', models.CharField(max_length=255, blank=True)),
                ('schedulereason', models.IntegerField(blank=True, choices=[(1, b'Legacy'), (2, b'Administrative'), (3, b'User'), (4, b'Automatic')])),
                ('starttime', models.DateTimeField()),
                ('duration', fk.fields.MillisecondField()),
            ],
            options={
                'db_table': 'ScheduleItem',
                'verbose_name': 'TX schedule entry',
                'verbose_name_plural': 'TX schedule entries',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SchedulePurpose',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('phone', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('mailing_address', models.CharField(default=b'', max_length=512, null=True, blank=True)),
                ('post_code', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('city', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('country', models.CharField(default=b'', max_length=255, null=True, blank=True)),
                ('legacy_username', models.CharField(default=b'', max_length=255, blank=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('header', models.TextField(max_length=2048, null=True, blank=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=2048, null=True, blank=True)),
                ('has_tono_records', models.BooleanField(default=False)),
                ('is_filler', models.BooleanField(default=False)),
                ('publish_on_web', models.BooleanField(default=True)),
                ('proper_import', models.BooleanField(default=False)),
                ('played_count_web', models.IntegerField(default=0, help_text=b'Number of times it has been played')),
                ('updated_time', models.DateTimeField(help_text=b'Time the program record has been updated', null=True)),
                ('uploaded_time', models.DateTimeField(help_text=b'Time the program record was created', null=True)),
                ('framerate', models.IntegerField(default=25000, help_text=b'Framerate of master video in thousands / second')),
                ('ref_url', models.CharField(help_text=b'URL for reference', max_length=1024, blank=True)),
                ('duration', fk.fields.MillisecondField()),
                ('categories', models.ManyToManyField(to='fk.Category')),
                ('editor', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(to='fk.Organization', help_text=b'Organization for video', null=True)),
            ],
            options={
                'db_table': 'Video',
                'get_latest_by': 'uploaded_time',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='VideoFile',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('filename', models.CharField(max_length=256)),
                ('old_filename', models.CharField(max_length=256)),
                ('format', models.ForeignKey(to='fk.FileFormat')),
                ('video', models.ForeignKey(to='fk.Video')),
            ],
            options={
                'verbose_name': 'video file',
                'verbose_name_plural': 'video files',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='WeeklySlot',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('day', models.IntegerField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday')])),
                ('start_time', models.TimeField()),
                ('duration', fk.fields.MillisecondField()),
                ('purpose', models.ForeignKey(blank=True, to='fk.SchedulePurpose', null=True)),
            ],
            options={
                'ordering': ('day', 'start_time', 'pk'),
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='schedulepurpose',
            name='direct_videos',
            field=models.ManyToManyField(to='fk.Video', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='schedulepurpose',
            name='organization',
            field=models.ForeignKey(blank=True, to='fk.Organization', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='scheduleitem',
            name='video',
            field=models.ForeignKey(blank=True, to='fk.Video', null=True),
            preserve_default=True,
        ),
    ]
