# Generated by Django 2.2.10 on 2020-08-24 16:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0011_auto_20200824_1817'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='videofile',
            name='old_filename',
        ),
    ]
