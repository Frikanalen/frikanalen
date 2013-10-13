# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from fk.models import FileFormat
from fk.models import Organization
from fk.models import UserProfile
from fk.models import Video, Category, Scheduleitem
from fk.models import VideoFile
from fk.models import SchedulePurpose, WeeklySlot

# In order to display the userprofile on
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    model = UserProfile

class UserProfileAdmin(UserAdmin):
    inlines = [ UserProfileInline, ]

class VideoFileInline(admin.StackedInline):
    fields = ('format', 'filename', 'old_filename')
    #readonly_fields = ['format', 'filename']
    model = VideoFile
    extra = 0

class VideoAdmin(admin.ModelAdmin):
    list_display = ('name', 'editor', 'organization')
    inlines = [VideoFileInline]
    search_fields = ["name", "description", "organization__name", "header", "editor__username"]
    list_filter = ("proper_import", "is_filler", "publish_on_web", "has_tono_records")

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'fkmember', 'orgnr')
    filter_horizontal = ("members",)
    ordering = ('name',)


class ScheduleitemAdmin(admin.ModelAdmin):
    list_filter = ("starttime", )
    list_display = ('__unicode__',
                    'video',
                    'schedulereason',
                    'starttime',
                    'duration')
    #list_display_links = ('starttime', 'video',)
    #inlines = [VideoInline]
    #exclude = ('video',)
    search_fields = ["video__name", "video__organization__name"]
    ordering = ('starttime',)

class SchedulePurposeAdmin(admin.ModelAdmin):
    list_display = (
        '__unicode__',
        'videos_str',
    )
    filter_horizontal = ('direct_videos',)

class WeeklySlotAdmin(admin.ModelAdmin):
    list_display = (
        '__unicode__',
        'day',
        'start_time',
        'duration',
        'purpose',
    )

admin.site.register(Category)
admin.site.register(FileFormat)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(SchedulePurpose, SchedulePurposeAdmin)
admin.site.register(Scheduleitem, ScheduleitemAdmin)
admin.site.register(User, UserProfileAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(VideoFile)
admin.site.register(WeeklySlot, WeeklySlotAdmin)
