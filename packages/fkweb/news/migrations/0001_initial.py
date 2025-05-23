# Generated by Django 3.1.1 on 2020-12-29 18:41

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Bulletin",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("heading", models.CharField(max_length=80)),
                ("text", models.TextField()),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("is_published", models.BooleanField(default=False)),
            ],
        ),
    ]
