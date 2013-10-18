# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from fk.models import Scheduleitem, Video, VideoFile
from rest_framework import serializers, fields

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
            "editor",
            "organization",
            "duration",
            #'videofiles',
            "categories",
            "has_tono_records",
            "is_filler",
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
