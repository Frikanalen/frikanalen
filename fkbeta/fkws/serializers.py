# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from fk.models import AsRun
from fk.models import Category
from fk.models import Organization
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import VideoFile


User = get_user_model()


class VideoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoFile
        fields = (
            "id",
            "video",
            "format",
            "filename",
            "old_filename",
            "created_time",
            "integrated_lufs",
            "truepeak_lufs",
            )


class VideoSerializer(serializers.ModelSerializer):
    editor = serializers.SlugRelatedField(
        slug_field='username', queryset=User.objects.all(),
        default=serializers.CurrentUserDefault())
    organization = serializers.SlugRelatedField(
        slug_field='name', queryset=Organization.objects.all(),
        required=False)
    categories = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=Category.objects.all())

    class Meta:
        model = Video
        fields = (
            "id",
            "name",
            "header",
            "description",
            "editor",
            "organization",
            "duration",
            #'videofiles',
            "categories",
            "framerate",
            "proper_import",
            "has_tono_records",
            "publish_on_web",
            "is_filler",
            "ref_url",
            "created_time",
            "updated_time",
            "uploaded_time",
            "ogv_url",
            "large_thumbnail_url",
            )
        read_only_fields = (
            "framerate", "created_time", "updated_time")

    def validate(self, data):
        is_creation = not self.instance
        if is_creation and not data.get('organization'):
            potential_orgs = data['editor'].organization_set.all()
            if len(potential_orgs) == 0:
                raise serializers.ValidationError(
                    {'organization': "Field required when "
                      "editor has no organization."})
            elif len(potential_orgs) > 1:
                raise serializers.ValidationError(
                    [{'organization': "Field required when "
                      "editor has more than one organization."}])
            data['organization'] = potential_orgs[0]
        return data


class VideoUploadTokenSerializer(serializers.ModelSerializer):
    upload_url = serializers.SerializerMethodField()

    def get_upload_url(self, video_upload_token):
        return settings.FK_UPLOAD_URL

    class Meta:
        model = Video
        fields = (
            'upload_token',
            'upload_url',
        )


class ScheduleitemSerializer(serializers.ModelSerializer):
    video = VideoSerializer(required=False, read_only=True)
    video_id = serializers.HyperlinkedRelatedField(
        source="video", view_name="api-video-detail", required=False,
        queryset=Video.objects.all())

    class Meta:
        model = Scheduleitem
        fields = (
            "id",
            "default_name",
            "video_id",
            "video",
            "schedulereason",
            "starttime",
            "duration"
            )

    def validate(self, data):
        if 'starttime' in data or 'duration' in data:
            def g(v):
                return self.instance and getattr(self.instance, v)
            start = data.get('starttime', g('starttime'))
            end = start + data.get('duration', g('duration'))
            sur_start, sur_end = (
                Scheduleitem.objects.expand_to_surrounding(start, end))
            items = (Scheduleitem.objects.exclude(pk=g('id'))
                .filter(starttime__gte=sur_start, starttime__lte=sur_end)
                .order_by('starttime'))
            for entry in items:
                if entry.starttime <= start < entry.endtime():
                    raise serializers.ValidationError(
                        {'duration': "Conflict with '%s'." % entry})
                if entry.starttime < end < entry.endtime():
                    raise serializers.ValidationError(
                        {'duration': "Conflict with '%s'." % entry})
        return data


class AsRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsRun
        fields = (
            'id',
            'video',
            'program_name',
            'playout',
            'played_at',
            'in_ms',
            'out_ms',
        )


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = (
            'created',
            'key',
            'user',
        )


class CategorySerializer(serializers.ModelSerializer):
    videocount = serializers.SerializerMethodField('count_videos')
    def count_videos(self, category):
        return (Video.objects
                .public()
                .filter(categories=category)
                .count())
    class Meta:
        model = Category
        fields = (
            'id',
            'name',
            'desc',
            'videocount',
        )


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            'id',
            'name',
            'fkmember',
            'orgnr',
            'homepage',
        )
