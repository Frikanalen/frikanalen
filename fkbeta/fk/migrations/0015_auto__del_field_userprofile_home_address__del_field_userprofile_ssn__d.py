# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'UserProfile.home_address'
        db.delete_column('fk_userprofile', 'home_address')

        # Deleting field 'UserProfile.ssn'
        db.delete_column('fk_userprofile', 'ssn')

        # Deleting field 'UserProfile.phone_home'
        db.delete_column('fk_userprofile', 'phone_home')

        # Deleting field 'UserProfile.home_zip'
        db.delete_column('fk_userprofile', 'home_zip')

        # Deleting field 'UserProfile.home_city'
        db.delete_column('fk_userprofile', 'home_city')

        # Deleting field 'UserProfile.home_country'
        db.delete_column('fk_userprofile', 'home_country')

        # Deleting field 'UserProfile.phone_work'
        db.delete_column('fk_userprofile', 'phone_work')

        # Deleting field 'UserProfile.phone_mobile'
        db.delete_column('fk_userprofile', 'phone_mobile')

        # Adding field 'UserProfile.phone'
        db.add_column('fk_userprofile', 'phone',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.mailing_address'
        db.add_column('fk_userprofile', 'mailing_address',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=512, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.post_code'
        db.add_column('fk_userprofile', 'post_code',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.city'
        db.add_column('fk_userprofile', 'city',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.country'
        db.add_column('fk_userprofile', 'country',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)


        # Changing field 'Scheduleitem.schedulereason'
        db.alter_column(u'ScheduleItem', 'schedulereason', self.gf('django.db.models.fields.IntegerField')(default=0))

    def backwards(self, orm):
        # Adding field 'UserProfile.home_address'
        db.add_column('fk_userprofile', 'home_address',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=512, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.ssn'
        db.add_column('fk_userprofile', 'ssn',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.phone_home'
        db.add_column('fk_userprofile', 'phone_home',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.home_zip'
        db.add_column('fk_userprofile', 'home_zip',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.home_city'
        db.add_column('fk_userprofile', 'home_city',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.home_country'
        db.add_column('fk_userprofile', 'home_country',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.phone_work'
        db.add_column('fk_userprofile', 'phone_work',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Adding field 'UserProfile.phone_mobile'
        db.add_column('fk_userprofile', 'phone_mobile',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=255, blank=True),
                      keep_default=False)

        # Deleting field 'UserProfile.phone'
        db.delete_column('fk_userprofile', 'phone')

        # Deleting field 'UserProfile.mailing_address'
        db.delete_column('fk_userprofile', 'mailing_address')

        # Deleting field 'UserProfile.post_code'
        db.delete_column('fk_userprofile', 'post_code')

        # Deleting field 'UserProfile.city'
        db.delete_column('fk_userprofile', 'city')

        # Deleting field 'UserProfile.country'
        db.delete_column('fk_userprofile', 'country')


        # Changing field 'Scheduleitem.schedulereason'
        db.alter_column(u'ScheduleItem', 'schedulereason', self.gf('django.db.models.fields.IntegerField')(null=True))

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
            'Meta': {'object_name': 'Organization', 'db_table': "u'Organization'"},
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
        'fk.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'legacy_username': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'mailing_address': ('django.db.models.fields.CharField', [], {'max_length': '512', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'post_code': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
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
        }
    }

    complete_apps = ['fk']