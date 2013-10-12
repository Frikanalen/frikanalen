# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, include, url


# Enable the admin:
from django.contrib import admin
admin.autodiscover()
urlpatterns = patterns('', (r'^admin/', include(admin.site.urls)))

# Only used with DEBUG. Serves static content right from source
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()

# Add pages from agenda.
import agenda.urls
urlpatterns += agenda.urls.urlpatterns

# Add public vod pages
import fkvod.urls
urlpatterns += fkvod.urls.urlpatterns

# Add webservices
import fkws.urls
urlpatterns += fkws.urls.urlpatterns


"""
# Add registration and login
urlpatterns += patterns('',
    (r'^accounts/', include('registration.urls')),
    (r'^accounts/', include('registration.backends.simple.urls')),
    (r'^accounts/', include('registration.backends.default.urls')),
    )
"""

# Create a simple frontpage for now
from django.views.generic import TemplateView
class Frontpage(TemplateView):
    template_name = "frontpage.html"
    def get_context_data(self, **kwargs):
        context = {
            "title": "frikanalen.tv er midlertidig nede"
            }
        return context

urlpatterns += patterns('',
    url(r'^$', Frontpage.as_view(), name="frontpage"),
    )


"""
from django.conf.urls.static import static
urlpatterns = patterns('',
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),

    #url(r'^restframework', include('rest_framework.urls', namespace='rest_framework')),

    #(r'^migrate/$', 'fkmigrate.views.migrator'),

    # Public Web
    #url(r'^$', agenda.views.WebVideos.as_view(), name='frontpage'),
    #url(r'^agenda/user/(?P<user>[A-Za-z0-9-\.*]+)/$', agenda.views.UserVideos.as_view(), name='user_videos'),
    #url(r'^agenda/events/', agenda.views.EventsView.as_view(), name='events'),
    #url(r'^agenda/video/(?P<video_id>[0-9]+)$', agenda.views.VideoDetails.as_view(), name='video_details'),
    # Management
    #(r'^agenda/editor/$', 'agenda.views.editor'),
    #(r'^agenda/videos/$', 'agenda.views.manage_videos'),
    #(r'^agenda/videos/originals/$', 'agenda.views.originals'),
    #url(r'^agenda/videos/new/$', agenda.views.ManageVideoNew.as_view(), name='manage_video_new'),
    #url(r'^agenda/videos/edit/(?P<id>[0-9]+)$', agenda.views.ManageVideoEdit.as_view(), name='manage_video_edit'),


    # deprecated, only for timeline test, pure json
    #(r'^agenda/schedule/$', 'agenda.views.schedule'),

    # Video webservice
    # Currently lists all videos made by the logged in user
    #url(r'^agenda/ws/videos/$', agenda.views.VideosView.as_view(), name='videos'),
    #url(r'^agenda/ws/video/(?P<video_id>[0-9]+)/history/$', agenda.views.VideoHistoryView.as_view(), name='video_schedule'),
    #url(r'^agenda/ws/video/(?P<num>[0-9]+)/$', agenda.views.VideoView.as_view(), name='video'),

    #url(r'^agenda/ws/schedule/$',                 agenda.views.ScheduleView.as_view(), name='schedule'),
    #url(r'^agenda/ws/schedule/(?P<num>[0-9]+)/$', agenda.views.ScheduleItemView.as_view(), name='schedule_item'),

    # registration
    #(r'^accounts/', include('registration.urls')),
    #(r'^accounts/', include('registration.backends.simple.urls')),
    #(r'^accounts/', include('registration.backends.default.urls')),
    )
"""
# deprecated, move to static/agenda
#urlpatterns += static('agenda/editor/timeline/', document_root="../web/timeline")
#urlpatterns += static('agenda/editor/', document_root="../web/")
#urlpatterns += static('media/', document_root=settings.MEDIA_ROOT)

