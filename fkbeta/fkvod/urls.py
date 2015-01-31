# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, url

from fkvod import views


urlpatterns = patterns('fkvod.views',
    url(r'^video/$', views.VideoList.as_view(),
        name='video-list'),
    url(r'^video/(?P<video_id>\d+)$', views.VideoDetail.as_view(),
        name='video-detail'),
    url(r'^organization/(?P<orgid>\d+)$', views.OrganizationVideos.as_view(),
        name='org-video-list'),
)
