# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import include
from django.conf.urls import url
from rest_framework.routers import SimpleRouter
from rest_framework.urlpatterns import format_suffix_patterns

from fkws import views


router = SimpleRouter()
router.register(r'api/asrun', views.AsRunViewSet)

urlpatterns = [
    url(r'^ws/(.*)', views.wschange_redirect_view),
    url(r'^api/$', views.api_root, name='api-root'),
    url(r'^api/jukebox_csv$', views.jukebox_csv, name='jukebox-csv'),
    url(r'^api/obtain-token$',
        views.ObtainAuthToken.as_view(), name='api-token-auth'),
    url(r'^api/scheduleitems/$',
        views.ScheduleitemList.as_view(), name='api-scheduleitem-list'),
    url(r'^api/scheduleitems/(?P<pk>\d+)$',
        views.ScheduleitemDetail.as_view(), name='api-scheduleitem-detail'),
    url(r'^api/videos/$',
        views.VideoList.as_view(), name='api-video-list'),
    url(r'^api/videos/(?P<pk>\d+)/upload_token$',
        views.VideoUploadTokenDetail.as_view(), name='api-video-upload-token-detail'),
    url(r'^api/videos/(?P<pk>\d+)$',
        views.VideoDetail.as_view(), name='api-video-detail'),
    url(r'^api/videofiles/$',
        views.VideoFileList.as_view(), name='api-videofile-list'),
    url(r'^api/videofiles/(?P<pk>\d+)$',
        views.VideoFileDetail.as_view(), name='api-videofile-detail'),
]

urlpatterns += router.urls


# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns,
                                     allowed=['json', 'api', 'xml'])

# Default login/logout views
urlpatterns += [
    url(r'^api/api-auth/',
        include('rest_framework.urls', namespace='rest_framework'))
]
