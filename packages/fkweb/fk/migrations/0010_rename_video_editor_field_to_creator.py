# Generated by Django 2.2.10 on 2020-05-05 15:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0009_add_legally_required_fields'),
    ]

    operations = [
        migrations.RenameField('Video', 'editor', 'creator'),
    ]