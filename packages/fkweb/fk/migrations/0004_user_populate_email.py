from __future__ import unicode_literals

from django.db import migrations, models

def populate_email(apps, schema_editor):
    User = apps.get_model('fk', 'user')
    db_alias = schema_editor.connection.alias
    for row in User.objects.using(db_alias).all():
        if row.email:
            if row.first_name:
                continue
            row.first_name = row.username
        elif '@' in row.username:
            row.email = row.username
        else:
            row.email = "%s@example.com" % row.username
        row.save()


class Migration(migrations.Migration):
    dependencies = [('fk', '0003_user_add_new_fields')]
    operations = [
        migrations.RunPython(populate_email, migrations.RunPython.noop, elidable=True),
    ]
