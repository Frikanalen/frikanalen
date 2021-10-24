from rest_framework import serializers

from fk.models import VideoFile


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
