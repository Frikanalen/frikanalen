# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from fk.forms import UserChangeForm
from fk.forms import UserCreationForm
from fk.models import Category
from fk.models import FileFormat
from fk.models import Organization
from fk.models import SchedulePurpose
from fk.models import Scheduleitem
from fk.models import User
from fk.models import Video
from fk.models import VideoFile
from fk.models import WeeklySlot


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'date_of_birth', 'is_superuser')
    list_filter = ('is_superuser',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('date_of_birth',)}),
        ('Permissions', {'fields': ('is_superuser',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'date_of_birth', 'password1', 'password2')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()




class VideoFileInline(admin.StackedInline):
    fields = ('format', 'filename', 'old_filename')
    #readonly_fields = ['format', 'filename']
    model = VideoFile
    extra = 0

class VideoAdmin(admin.ModelAdmin):
    list_display = ('name', 'editor', 'organization')
    inlines = [VideoFileInline]
    search_fields = ["name", "description", "organization__name", "header", "editor__email"]
    list_filter = ("proper_import", "is_filler", "publish_on_web", "has_tono_records")

class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'fkmember', 'orgnr')
    filter_horizontal = ("members",)
    list_filter = ('fkmember',)
    ordering = ('name',)


class ScheduleitemAdmin(admin.ModelAdmin):
    list_filter = ('starttime', 'schedulereason', 'video__organization')
    list_display = ('__str__',
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
        '__str__',
        'videos_str',
    )
    filter_horizontal = ('direct_videos',)

class WeeklySlotAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
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
admin.site.register(User, UserAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(VideoFile)
admin.site.register(WeeklySlot, WeeklySlotAdmin)

# We're not using Django's built-in permissions as it is
admin.site.unregister(Group)
