from fk.models import Scheduleitem, Video, VideoFile
from rest_framework import serializers, fields

class VideofileSerializer(serializers.ModelSerializer):
	format = fields.Field(source="format.fsname") 
	class Meta:
		model = VideoFile
		fields = (
			"format",
			"filename",
			"old_filename"
			)

class VideoSerializer(serializers.ModelSerializer):
	#editor = Charfield(source="editor")
	editor = fields.Field(source="editor.username") 
	organization = fields.Field(source="organization") 
	videofiles = VideofileSerializer(source="videofiles")
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
			)

class ScheduleitemSerializer(serializers.ModelSerializer):
	video = VideoSerializer()
	video_id = serializers.HyperlinkedRelatedField(source="video", view_name="api-video-detail", read_only=False, required=False)
	class Meta:
		model = Scheduleitem
		fields = (
			"id",
			"default_name", 
			"video_id",
			"video", 
			#"schedulereason", 
			"starttime", 
			"duration"
			)
