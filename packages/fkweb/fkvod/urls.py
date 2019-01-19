# Copyright (c) 2012-2015 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import url

from fkvod import views


urlpatterns = [
    url(r'^video/$', views.VideoList.as_view(),
        name='vod-video-list'),
    url(r'^video/(?P<video_id>\d+)/$', views.VideoDetail.as_view(),
        name='vod-video-detail'),
    url(r'^video/rss/$', views.RssVideos.as_view(), name='video-list-rss'),
    url(r'^organization/(?P<orgid>\d+)/$', views.OrganizationVideos.as_view(),
        name='vod-org-video-list'),
    url(r'^organization/(?P<orgid>\d+)/rss/$', views.RssVideos.as_view(),
        name='video-list-rss'),
    url(r'^category/$', views.CategoryList.as_view(),
        name='vod-category-list'),
    url(r'^category/(?P<categoryname>[-a-zA-Z0-9/ ]+)/rss/$', views.RssVideos.as_view(),
        name='vod-category-video-list-rss'),
    url(r'^category/(?P<categoryname>[-a-zA-Z0-9/ ]+)/$', views.CategoryVideos.as_view(),
        name='vod-category-video-list'),
]
