# -*- coding: utf-8 -*-
# Generated by Django 1.11.26 on 2019-11-17 21:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('fk', '0002_rename_all_custom_tables_to_default'),
    ]

    operations = [
        migrations.AlterModelOptions(name='user', options={}),
        migrations.AlterModelManagers(name='user', managers=[ ]),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, verbose_name='email address'),
        ),
        migrations.AddField(model_name='user', name='date_of_birth', field=models.DateField(blank=True, null=True)),
    ]