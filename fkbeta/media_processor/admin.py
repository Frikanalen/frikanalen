from django.contrib import admin
from media_processor.models import Task, MediaUpload

class TaskAdmin(admin.ModelAdmin):
    list_display = ('pk', 'source_file', 'target_format', 'status')
    list_filter = ('status', 'target_format')
    raw_id_fields = ('source_file',)

class MediaUploadAdmin(admin.ModelAdmin):
    list_display = (
        'filename',
        'size',
        'last_write_at',
        'state',
        'uploader'
        #'target_video',
    )

admin.site.register(Task, TaskAdmin)
admin.site.register(MediaUpload, MediaUploadAdmin)
