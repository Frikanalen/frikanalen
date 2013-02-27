from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from fkws.views import *

urlpatterns = patterns('fkws.views',
    url(r'^ws/$', 'api_root'),
    url(r'^ws/scheduleitems/$', ScheduleitemList.as_view(), name='api-scheduleitem-list'),
    url(r'^ws/scheduleitems/(?P<pk>\d+)$', ScheduleitemDetail.as_view(), name='api-scheduleitem-detail'),
    url(r'^ws/videos/$', VideoList.as_view(), name='api-video-list'),
    url(r'^ws/videos/(?P<pk>\d+)$', VideoDetail.as_view(), name='api-video-detail'),
)

# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api', 'xml'])

# Default login/logout views
urlpatterns += patterns('',
    url(r'^ws/api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)