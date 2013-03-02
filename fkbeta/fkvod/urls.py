# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, url, include
from fkvod.views import *

urlpatterns = patterns('fkvod.views',
    url(r'^video/$', VideoList.as_view(), name='video-list'),
    url(r'^video/(?P<video_id>\d+)$', VideoDetail.as_view(), name='video-list'),
    url(r'^organization/(?P<orgid>\d+)$', OrganizationVideos.as_view(), name='org-video-list'),

    
)
