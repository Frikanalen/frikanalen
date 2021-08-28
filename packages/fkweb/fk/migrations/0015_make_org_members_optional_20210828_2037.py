# Make organization members optional.
# As there is now an "editor" field, an org with 0 members is perfectly valid.

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fk', '0014_auto_20210811_0138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='members',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
