# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from rest_framework import fields
from rest_framework import serializers

from fk.models import AsRun
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import VideoFile


class VideoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoFile
        fields = (
            "id",
            "video",
            "format",
            "filename",
            "old_filename"
            )


class VideoSerializer(serializers.ModelSerializer):
    editor = fields.Field(source="editor.username")
    organization = fields.Field(source="organization")
    #videofiles = VideoFileSerializer(source="videofiles")
    categories = fields.Field(source="category_list")
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
            "has_tono_records",
            "publish_on_web",
            "is_filler",
            "ref_url",
            )


class ScheduleitemSerializer(serializers.ModelSerializer):
    video = VideoSerializer(required=False)
    video_id = serializers.HyperlinkedRelatedField(
                    source="video",
                    view_name="api-video-detail",
                    read_only=False,
                    required=False)
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


class AsRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsRun
