# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from fkbeta.fk.models import UserProfile
from fkbeta.fk.models import Video, Category, Scheduleitem
from fkbeta.fk.models import FileFormat
from fkbeta.fk.models import VideoFile
from fkbeta.fk.models import Organization

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
	list_display = ('__unicode__', 'duration')
	#list_display_links = ('starttime', 'video',)
	#inlines = [VideoInline]
	#exclude = ('video',)
	search_fields = ["video__name", "video__organization__name"]
	ordering = ('starttime',)

admin.site.register(User, UserProfileAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(Category)
admin.site.register(FileFormat)
admin.site.register(VideoFile)
admin.site.register(Scheduleitem, ScheduleitemAdmin)
admin.site.register(Organization, OrganizationAdmin)
