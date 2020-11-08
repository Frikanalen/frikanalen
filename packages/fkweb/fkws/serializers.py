# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

import logging

from fk.models import AsRun
from fk.models import Category
from fk.models import Organization
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import User
from fk.models import VideoFile

logger = logging.getLogger(__name__)

class OrganizationSerializer(serializers.ModelSerializer):
    editor_name = serializers.SerializerMethodField()

    def get_editor_name(self, obj):
        if obj.editor:
            return obj.editor.first_name + " " + obj.editor.last_name
        logger.warning('Organization %d has no editor assigned' % (obj.id))
        return 'Ingen redaktør!'

    class Meta:
        model = Organization
        fields = (
                'id',
                'name',
                'homepage',
                'postal_address',
                'street_address',
                'editor_id',
                'editor_name',
        )

class VideoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoFile
        fields = (
            "id",
            "video",
            "format",
            "filename",
            "created_time",
            "integrated_lufs",
            "truepeak_lufs",
            )


class VideoSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    creator = serializers.SlugRelatedField(
        slug_field='email', queryset=get_user_model().objects.all(),
        default=serializers.CurrentUserDefault())
    categories = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=Category.objects.all())
    files = serializers.SerializerMethodField()

    def get_files(self, video):
        file_list = {}
        for vf in VideoFile.objects.filter(video=video):
            file_list[vf.format.fsname] = settings.FK_MEDIA_URLPREFIX+vf.location(relative=True)
        return file_list

    class Meta:
        model = Video
        fields = (
            "id",
            "name",
            "header",
            "description",
            "files",
            "creator",
            "files",
            "organization",
            "duration",
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
            "framerate", "created_time", "updated_time", "files")

    def validate(self, data):
        is_creation = not self.instance
        if is_creation and not data.get('organization'):
            potential_orgs = data['creator'].organization_set.all()
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


class VideoCreateSerializer(VideoSerializer):
    organization = serializers.SlugRelatedField(
        slug_field='id', queryset=Organization.objects.all(),
        required=False)


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

class ScheduleitemVideoSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    creator = serializers.SlugRelatedField(
        slug_field='email', queryset=get_user_model().objects.all(),
        default=serializers.CurrentUserDefault())
    categories = serializers.SlugRelatedField(
        slug_field='name', many=True, queryset=Category.objects.all())

    class Meta:
        model = Video
        fields = (
            "id",
            "name",
            "header",
            "description",
            "creator",
            "organization",
            "duration",
            "categories",
            )
        read_only_fields = (
            "framerate", "created_time", "updated_time")

class ScheduleitemSerializer(serializers.ModelSerializer):
    video = ScheduleitemVideoSerializer(read_only=True)
    video_url = serializers.HyperlinkedRelatedField(
        source="video", view_name="api-video-detail", required=False,
        queryset=Video.objects.all())

    class Meta:
        model = Scheduleitem
        fields = (
            "id",
            "video_url",
            "video",
            "schedulereason",
            "starttime",
            "endtime",
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

class NewUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # These two need to be explitly included because
    # they are not required in the database model
    # but we want new users to have these values set
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    date_of_birth = serializers.DateField()

    def create(self, validated_data):
        user = get_user_model().objects.create(
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            date_of_birth = validated_data['date_of_birth']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = (
                'id',
                'email',
                'first_name',
                'last_name',
                'date_of_birth',
                'password'
                )

        write_only_fields = (
                'password',
                )


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    organization_roles = serializers.SerializerMethodField()

    def get_organization_roles(self, obj):
        editor_list = list(obj.editor.all())

        # A user may be both member and editor. As editor status supersedes
        # member status, if they are editor, we filter out the membership
        membership_list = list(filter(lambda x: x not in editor_list,
                                      obj.organization_set.all()))

        return list(
            [
                {
                    'role': 'editor',
                    'organization_id': o.id,
                    'organization_name': o.name
                }
                for o in editor_list
            ] + [
                {
                    'role': 'member',
                    'organization_id': o.id,
                    'organization_name': o.name
                }
                for o in membership_list
            ]
        )

    class Meta:
        model = User

        fields = (
                'id',
                'email',
                'first_name',
                'last_name',
                'date_joined',
                'is_staff',
                'date_of_birth',
                'phone_number',
                'organization_roles',
                'password'
                )

        read_only_fields = (
                'id',
                'email',
                'is_staff',
                'date_joined',
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
