# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Organization'
        db.create_table(u'Organization', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=255, blank=True)),
            ('fkmember', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('orgnr', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal('fk', ['Organization'])

        # Adding M2M table for field members on 'Organization'
        m2m_table_name = db.shorten_name(u'Organization_members')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('organization', models.ForeignKey(orm['fk.organization'], null=False)),
            ('user', models.ForeignKey(orm['auth.user'], null=False))
        ))
        db.create_unique(m2m_table_name, ['organization_id', 'user_id'])

        # Adding model 'FileFormat'
        db.create_table(u'ItemType', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('description', self.gf('django.db.models.fields.TextField')(max_length=255, unique=True, null=True, blank=True)),
            ('fsname', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('rgb', self.gf('colorful.fields.RGBColorField')(default='cccccc', max_length=7)),
        ))
        db.send_create_signal('fk', ['FileFormat'])

        # Adding model 'VideoFile'
        db.create_table('fk_videofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('video', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Video'])),
            ('format', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.FileFormat'])),
            ('filename', self.gf('django.db.models.fields.CharField')(max_length=256)),
            ('old_filename', self.gf('django.db.models.fields.CharField')(max_length=256)),
        ))
        db.send_create_signal('fk', ['VideoFile'])

        # Adding model 'Category'
        db.create_table(u'Category', (
            ('id', self.gf('django.db.models.fields.IntegerField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('rgb', self.gf('colorful.fields.RGBColorField')(max_length=7)),
            ('desc', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
        ))
        db.send_create_signal('fk', ['Category'])

        # Adding model 'Video'
        db.create_table(u'Video', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('header', self.gf('django.db.models.fields.TextField')(max_length=2048, null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=2048, null=True, blank=True)),
            ('editor', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('has_tono_records', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('is_filler', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('publish_on_web', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('proper_import', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('played_count_web', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('updated_time', self.gf('django.db.models.fields.DateTimeField')(null=True)),
            ('uploaded_time', self.gf('django.db.models.fields.DateTimeField')(null=True)),
            ('framerate', self.gf('django.db.models.fields.IntegerField')(default=25000)),
            ('organization', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Organization'], null=True)),
            ('ref_url', self.gf('django.db.models.fields.CharField')(max_length=1024, blank=True)),
            ('duration', self.gf('fk.fields.MillisecondField')()),
        ))
        db.send_create_signal('fk', ['Video'])

        # Adding M2M table for field categories on 'Video'
        m2m_table_name = db.shorten_name(u'Video_categories')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('video', models.ForeignKey(orm['fk.video'], null=False)),
            ('category', models.ForeignKey(orm['fk.category'], null=False))
        ))
        db.create_unique(m2m_table_name, ['video_id', 'category_id'])

        # Adding model 'SchedulePurpose'
        db.create_table('fk_schedulepurpose', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('organization', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Organization'], null=True, blank=True)),
        ))
        db.send_create_signal('fk', ['SchedulePurpose'])

        # Adding M2M table for field direct_videos on 'SchedulePurpose'
        m2m_table_name = db.shorten_name('fk_schedulepurpose_direct_videos')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('schedulepurpose', models.ForeignKey(orm['fk.schedulepurpose'], null=False)),
            ('video', models.ForeignKey(orm['fk.video'], null=False))
        ))
        db.create_unique(m2m_table_name, ['schedulepurpose_id', 'video_id'])

        # Adding model 'WeeklySlot'
        db.create_table('fk_weeklyslot', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('purpose', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.SchedulePurpose'], null=True, blank=True)),
            ('day', self.gf('django.db.models.fields.IntegerField')()),
            ('start_time', self.gf('django.db.models.fields.TimeField')()),
            ('duration', self.gf('fk.fields.MillisecondField')()),
        ))
        db.send_create_signal('fk', ['WeeklySlot'])

        # Adding model 'Scheduleitem'
        db.create_table(u'ScheduleItem', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('default_name', self.gf('django.db.models.fields.CharField')(max_length=255, blank=True)),
            ('video', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Video'], null=True, blank=True)),
            ('schedulereason', self.gf('django.db.models.fields.IntegerField')(blank=True)),
            ('starttime', self.gf('django.db.models.fields.DateTimeField')()),
            ('duration', self.gf('fk.fields.MillisecondField')()),
        ))
        db.send_create_signal('fk', ['Scheduleitem'])

        # Adding model 'UserProfile'
        db.create_table('fk_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('phone', self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True)),
            ('mailing_address', self.gf('django.db.models.fields.CharField')(default='', max_length=512, null=True, blank=True)),
            ('post_code', self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True)),
            ('city', self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True)),
            ('country', self.gf('django.db.models.fields.CharField')(default='', max_length=255, null=True, blank=True)),
            ('legacy_username', self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True)),
        ))
        db.send_create_signal('fk', ['UserProfile'])


    def backwards(self, orm):
        # Deleting model 'Organization'
        db.delete_table(u'Organization')

        # Removing M2M table for field members on 'Organization'
        db.delete_table(db.shorten_name(u'Organization_members'))

        # Deleting model 'FileFormat'
        db.delete_table(u'ItemType')

        # Deleting model 'VideoFile'
        db.delete_table('fk_videofile')

        # Deleting model 'Category'
        db.delete_table(u'Category')

        # Deleting model 'Video'
        db.delete_table(u'Video')

        # Removing M2M table for field categories on 'Video'
        db.delete_table(db.shorten_name(u'Video_categories'))

        # Deleting model 'SchedulePurpose'
        db.delete_table('fk_schedulepurpose')

        # Removing M2M table for field direct_videos on 'SchedulePurpose'
        db.delete_table(db.shorten_name('fk_schedulepurpose_direct_videos'))

        # Deleting model 'WeeklySlot'
        db.delete_table('fk_weeklyslot')

        # Deleting model 'Scheduleitem'
        db.delete_table(u'ScheduleItem')

        # Deleting model 'UserProfile'
        db.delete_table('fk_userprofile')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'fk.category': {
            'Meta': {'object_name': 'Category', 'db_table': "u'Category'"},
            'desc': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'id': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rgb': ('colorful.fields.RGBColorField', [], {'max_length': '7'})
        },
        'fk.fileformat': {
            'Meta': {'object_name': 'FileFormat', 'db_table': "u'ItemType'"},
            'description': ('django.db.models.fields.TextField', [], {'max_length': '255', 'unique': 'True', 'null': 'True', 'blank': 'True'}),
            'fsname': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'rgb': ('colorful.fields.RGBColorField', [], {'default': "'cccccc'", 'max_length': '7'})
        },
        'fk.organization': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Organization', 'db_table': "u'Organization'"},
            'description': ('django.db.models.fields.TextField', [], {'max_length': '255', 'blank': 'True'}),
            'fkmember': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'members': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.User']", 'symmetrical': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'orgnr': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'})
        },
        'fk.scheduleitem': {
            'Meta': {'object_name': 'Scheduleitem', 'db_table': "u'ScheduleItem'"},
            'default_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'duration': ('fk.fields.MillisecondField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'schedulereason': ('django.db.models.fields.IntegerField', [], {'blank': 'True'}),
            'starttime': ('django.db.models.fields.DateTimeField', [], {}),
            'video': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Video']", 'null': 'True', 'blank': 'True'})
        },
        'fk.schedulepurpose': {
            'Meta': {'object_name': 'SchedulePurpose'},
            'direct_videos': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['fk.Video']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'organization': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Organization']", 'null': 'True', 'blank': 'True'})
        },
        'fk.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'city': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'legacy_username': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'blank': 'True'}),
            'mailing_address': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '512', 'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'post_code': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'})
        },
        'fk.video': {
            'Meta': {'object_name': 'Video', 'db_table': "u'Video'"},
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['fk.Category']", 'symmetrical': 'False'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'duration': ('fk.fields.MillisecondField', [], {}),
            'editor': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'framerate': ('django.db.models.fields.IntegerField', [], {'default': '25000'}),
            'has_tono_records': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'header': ('django.db.models.fields.TextField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_filler': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'organization': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Organization']", 'null': 'True'}),
            'played_count_web': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'proper_import': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'publish_on_web': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'ref_url': ('django.db.models.fields.CharField', [], {'max_length': '1024', 'blank': 'True'}),
            'updated_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True'}),
            'uploaded_time': ('django.db.models.fields.DateTimeField', [], {'null': 'True'})
        },
        'fk.videofile': {
            'Meta': {'object_name': 'VideoFile'},
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '256'}),
            'format': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.FileFormat']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'old_filename': ('django.db.models.fields.CharField', [], {'max_length': '256'}),
            'video': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Video']"})
        },
        'fk.weeklyslot': {
            'Meta': {'ordering': "('day', 'start_time', 'pk')", 'object_name': 'WeeklySlot'},
            'day': ('django.db.models.fields.IntegerField', [], {}),
            'duration': ('fk.fields.MillisecondField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'purpose': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.SchedulePurpose']", 'null': 'True', 'blank': 'True'}),
            'start_time': ('django.db.models.fields.TimeField', [], {})
        }
    }

    complete_apps = ['fk']