# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-11-11 15:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='homepage',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name=b'Link back to the organisation home page.'),
        ),
    ]
