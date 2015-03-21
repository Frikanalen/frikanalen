from django.contrib import admin
from media_processor.models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ('pk', 'source_file', 'target_format', 'status')
    list_filter = ('status', 'target_format')
    raw_id_fields = ('source_file',)


admin.site.register(Task, TaskAdmin)
