# Generated by Django 2.2 on 2020-01-25 10:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("fk", "0005_user_rm_old_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="asrun",
            name="video",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="fk.Video",
            ),
        ),
        migrations.AlterField(
            model_name="scheduleitem",
            name="video",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="fk.Video",
            ),
        ),
        migrations.AlterField(
            model_name="schedulepurpose",
            name="organization",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="fk.Organization",
            ),
        ),
        migrations.AlterField(
            model_name="video",
            name="editor",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="video",
            name="organization",
            field=models.ForeignKey(
                help_text="Organization for video",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="fk.Organization",
            ),
        ),
        migrations.AlterField(
            model_name="videofile",
            name="format",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="fk.FileFormat"
            ),
        ),
        migrations.AlterField(
            model_name="videofile",
            name="video",
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="fk.Video"),
        ),
        migrations.AlterField(
            model_name="weeklyslot",
            name="purpose",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="fk.SchedulePurpose",
            ),
        ),
    ]
