# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UserProfile'
        db.create_table('fk_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('ssn', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('phone_home', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('phone_work', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('phone_mobile', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('home_address', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('home_zip', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('home_country', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('fk', ['UserProfile'])

        # Adding field 'Video.proper_import'
        db.add_column(u'Video', 'proper_import',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Video.played_count_web'
        db.add_column(u'Video', 'played_count_web',
                      self.gf('django.db.models.fields.IntegerField')(default=0),
                      keep_default=False)

        # Adding field 'Video.updated_time'
        db.add_column(u'Video', 'updated_time',
                      self.gf('django.db.models.fields.DateTimeField')(null=True),
                      keep_default=False)

        # Adding field 'Video.uploaded_time'
        db.add_column(u'Video', 'uploaded_time',
                      self.gf('django.db.models.fields.DateTimeField')(null=True),
                      keep_default=False)

        # Adding field 'Video.framerate'
        db.add_column(u'Video', 'framerate',
                      self.gf('django.db.models.fields.IntegerField')(default=25),
                      keep_default=False)

        # Adding field 'Video.organization'
        db.add_column(u'Video', 'organization',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Organization'], null=True),
                      keep_default=False)

        # Adding field 'Video.ref_url'
        db.add_column(u'Video', 'ref_url',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=1024, blank=True),
                      keep_default=False)


        # Changing field 'Video.description'
        db.alter_column(u'Video', 'description', self.gf('django.db.models.fields.CharField')(max_length=2048, null=True))
        # Adding field 'Scheduleitem.default_name'
        db.add_column(u'ScheduleItem', 'default_name',
                      self.gf('django.db.models.fields.TextField')(default='', max_length=255, blank=True),
                      keep_default=False)


        # Changing field 'Scheduleitem.video'
        db.alter_column(u'ScheduleItem', 'video_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['fk.Video'], null=True))
        # Adding field 'Organization.fkmember'
        db.add_column(u'Organization', 'fkmember',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Organization.orgnr'
        db.add_column(u'Organization', 'orgnr',
                      self.gf('django.db.models.fields.TextField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding M2M table for field members on 'Organization'
        db.create_table(u'Organization_members', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('organization', models.ForeignKey(orm['fk.organization'], null=False)),
            ('user', models.ForeignKey(orm['auth.user'], null=False))
        ))
        db.create_unique(u'Organization_members', ['organization_id', 'user_id'])


    def backwards(self, orm):
        # Deleting model 'UserProfile'
        db.delete_table('fk_userprofile')

        # Deleting field 'Video.proper_import'
        db.delete_column(u'Video', 'proper_import')

        # Deleting field 'Video.played_count_web'
        db.delete_column(u'Video', 'played_count_web')

        # Deleting field 'Video.updated_time'
        db.delete_column(u'Video', 'updated_time')

        # Deleting field 'Video.uploaded_time'
        db.delete_column(u'Video', 'uploaded_time')

        # Deleting field 'Video.framerate'
        db.delete_column(u'Video', 'framerate')

        # Deleting field 'Video.organization'
        db.delete_column(u'Video', 'organization_id')

        # Deleting field 'Video.ref_url'
        db.delete_column(u'Video', 'ref_url')


        # Changing field 'Video.description'
        db.alter_column(u'Video', 'description', self.gf('django.db.models.fields.CharField')(max_length=255, null=True))
        # Deleting field 'Scheduleitem.default_name'
        db.delete_column(u'ScheduleItem', 'default_name')


        # User chose to not deal with backwards NULL issues for 'Scheduleitem.video'
        raise RuntimeError("Cannot reverse this migration. 'Scheduleitem.video' and its values cannot be restored.")
        # Deleting field 'Organization.fkmember'
        db.delete_column(u'Organization', 'fkmember')

        # Deleting field 'Organization.orgnr'
        db.delete_column(u'Organization', 'orgnr')

        # Removing M2M table for field members on 'Organization'
        db.delete_table('Organization_members')


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
            'desc': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
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
            'Meta': {'object_name': 'Organization', 'db_table': "u'Organization'"},
            'description': ('django.db.models.fields.TextField', [], {'max_length': '255'}),
            'fkmember': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.IntegerField', [], {'primary_key': 'True'}),
            'members': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.User']", 'symmetrical': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'orgnr': ('django.db.models.fields.TextField', [], {'max_length': '255', 'blank': 'True'})
        },
        'fk.scheduleitem': {
            'Meta': {'object_name': 'Scheduleitem', 'db_table': "u'ScheduleItem'"},
            'default_name': ('django.db.models.fields.TextField', [], {'max_length': '255', 'blank': 'True'}),
            'duration': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'schedulereason': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'starttime': ('django.db.models.fields.DateTimeField', [], {}),
            'video': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Video']", 'null': 'True', 'blank': 'True'})
        },
        'fk.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'home_address': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'home_country': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'home_zip': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'phone_home': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'phone_mobile': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'phone_work': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'ssn': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'})
        },
        'fk.video': {
            'Meta': {'object_name': 'Video', 'db_table': "u'Video'"},
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['fk.Category']", 'symmetrical': 'False'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '2048', 'null': 'True', 'blank': 'True'}),
            'editor': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'framerate': ('django.db.models.fields.IntegerField', [], {'default': '25'}),
            'has_tono_records': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'header': ('django.db.models.fields.CharField', [], {'max_length': '512', 'null': 'True', 'blank': 'True'}),
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
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'format': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.FileFormat']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'old_filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'video': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['fk.Video']"})
        }
    }

    complete_apps = ['fk']