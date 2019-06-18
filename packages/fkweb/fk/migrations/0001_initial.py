# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-06-18 10:52
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AsRun',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('program_name', models.CharField(blank=True, default='', max_length=160)),
                ('playout', models.CharField(blank=True, default='main', max_length=255)),
                ('played_at', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('in_ms', models.IntegerField(blank=True, default=0)),
                ('out_ms', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ('-played_at', '-id'),
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('desc', models.CharField(blank=True, max_length=255)),
            ],
            options={
                'verbose_name': 'video category',
                'verbose_name_plural': 'video categories',
                'db_table': 'Category',
                'ordering': ('name', '-id'),
            },
        ),
        migrations.CreateModel(
            name='FileFormat',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('description', models.TextField(blank=True, max_length=255, null=True, unique=True)),
                ('fsname', models.CharField(max_length=20)),
                ('vod_publish', models.BooleanField(default=False, verbose_name='Present video format to video on demand?')),
                ('mime_type', models.CharField(blank=True, max_length=256, null=True)),
            ],
            options={
                'verbose_name': 'video file format',
                'verbose_name_plural': 'video file formats',
                'db_table': 'ItemType',
                'ordering': ('fsname', '-id'),
            },
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, max_length=255)),
                ('fkmember', models.BooleanField(default=False)),
                ('orgnr', models.CharField(blank=True, max_length=255)),
                ('homepage', models.CharField(blank=True, max_length=255, null=True, verbose_name='Link back to the organisation home page.')),
                ('members', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Organization',
                'ordering': ('name', '-id'),
            },
        ),
        migrations.CreateModel(
            name='Scheduleitem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('default_name', models.CharField(blank=True, max_length=255)),
                ('schedulereason', models.IntegerField(blank=True, choices=[(1, 'Legacy'), (2, 'Administrative'), (3, 'User'), (4, 'Automatic')])),
                ('starttime', models.DateTimeField()),
                ('duration', models.DurationField()),
            ],
            options={
                'verbose_name': 'TX schedule entry',
                'verbose_name_plural': 'TX schedule entries',
                'db_table': 'ScheduleItem',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='SchedulePurpose',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('videos', 'videos'), ('organization', 'organization')], max_length=32)),
                ('strategy', models.CharField(choices=[('latest', 'latest'), ('random', 'random'), ('least_scheduled', 'least_scheduled')], max_length=32)),
            ],
            options={
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('mailing_address', models.CharField(blank=True, default='', max_length=512, null=True)),
                ('post_code', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('city', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('country', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('legacy_username', models.CharField(blank=True, default='', max_length=255)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('header', models.TextField(blank=True, max_length=2048, null=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(blank=True, max_length=2048, null=True)),
                ('has_tono_records', models.BooleanField(default=False)),
                ('is_filler', models.BooleanField(default=False, help_text='You still have the editorial responsibility.  Only affect videos from members.', verbose_name='Play automatically?')),
                ('publish_on_web', models.BooleanField(default=True)),
                ('proper_import', models.BooleanField(default=False)),
                ('played_count_web', models.IntegerField(default=0, help_text='Number of times it has been played')),
                ('created_time', models.DateTimeField(auto_now_add=True, help_text='Time the program record was created', null=True)),
                ('updated_time', models.DateTimeField(auto_now=True, help_text='Time the program record has been updated', null=True)),
                ('uploaded_time', models.DateTimeField(blank=True, help_text='Time the original video for the program was uploaded', null=True)),
                ('framerate', models.IntegerField(default=25000, help_text='Framerate of master video in thousands / second')),
                ('ref_url', models.CharField(blank=True, help_text='URL for reference', max_length=1024)),
                ('duration', models.DurationField(blank=True, default=datetime.timedelta(0))),
                ('upload_token', models.CharField(blank=True, default='', help_text='Code for upload', max_length=32)),
                ('categories', models.ManyToManyField(to='fk.Category')),
                ('editor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(help_text='Organization for video', null=True, on_delete=django.db.models.deletion.CASCADE, to='fk.Organization')),
            ],
            options={
                'db_table': 'Video',
                'ordering': ('-id',),
                'get_latest_by': 'uploaded_time',
            },
        ),
        migrations.CreateModel(
            name='VideoFile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('filename', models.CharField(max_length=256)),
                ('old_filename', models.CharField(blank=True, default='', max_length=256)),
                ('integrated_lufs', models.FloatField(blank=True, null=True, verbose_name='Integrated LUFS of file defined in ITU R.128')),
                ('truepeak_lufs', models.FloatField(blank=True, null=True, verbose_name='True peak LUFS of file defined in ITU R.128')),
                ('created_time', models.DateTimeField(auto_now_add=True, help_text='Time the video file was created', null=True)),
                ('format', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fk.FileFormat')),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fk.Video')),
            ],
            options={
                'verbose_name': 'video file',
                'verbose_name_plural': 'video files',
                'ordering': ('-video_id', '-id'),
            },
        ),
        migrations.CreateModel(
            name='WeeklySlot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.IntegerField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday')])),
                ('start_time', models.TimeField()),
                ('duration', models.DurationField()),
                ('purpose', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='fk.SchedulePurpose')),
            ],
            options={
                'ordering': ('day', 'start_time', 'pk'),
            },
        ),
        migrations.AddField(
            model_name='schedulepurpose',
            name='direct_videos',
            field=models.ManyToManyField(blank=True, to='fk.Video'),
        ),
        migrations.AddField(
            model_name='schedulepurpose',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='fk.Organization'),
        ),
        migrations.AddField(
            model_name='scheduleitem',
            name='video',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='fk.Video'),
        ),
        migrations.AddField(
            model_name='asrun',
            name='video',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='fk.Video'),
        ),
    ]
