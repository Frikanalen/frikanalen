# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from fkws.views import *

urlpatterns = patterns('fkws.views',
    url(r'^ws/(.*)', 'wschange_redirect_view'),
    url(r'^api/$', 'api_root'),
    url(r'^api/scheduleitems/$', ScheduleitemList.as_view(), name='api-scheduleitem-list'),
    url(r'^api/scheduleitems/(?P<pk>\d+)$', ScheduleitemDetail.as_view(), name='api-scheduleitem-detail'),
    url(r'^api/videos/$', VideoList.as_view(), name='api-video-list'),
    url(r'^api/videos/(?P<pk>\d+)$', VideoDetail.as_view(), name='api-video-detail'),
)

# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api', 'xml'])

# Default login/logout views
urlpatterns += patterns('',
    url(r'^api/api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)
