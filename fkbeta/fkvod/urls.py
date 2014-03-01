# Copyright (c) 2012-2015 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import url

from fkvod import views


urlpatterns = [
    url(r'^video/$', views.VideoList.as_view(),
        name='vod-video-list'),
    url(r'^video/(?P<video_id>\d+)$', views.VideoDetail.as_view(),
        name='vod-video-detail'),
    url(r'^organization/(?P<orgid>\d+)$', views.OrganizationVideos.as_view(),
        name='vod-org-video-list'),
]
