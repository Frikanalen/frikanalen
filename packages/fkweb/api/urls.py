# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import include
from django.conf.urls import url
from django.urls import path
from rest_framework.routers import SimpleRouter
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_nested.routers import NestedSimpleRouter

from . import views


router = SimpleRouter()
router.register(r'api/asrun', views.AsRunViewSet)
router.register(r'api/categories', views.CategoryViewSet)
router.register(r'api/videos', views.VideoViewSet, basename='api-video')

video_router = NestedSimpleRouter(router, r'api/videos', lookup='video')
video_router.register(r'assets', views.VideoAssetViewSet, basename='api-video-assets')

urlpatterns = [
    url(r'^api/$', views.api_root, name='api-root'),
    url(r'^api/jukebox_csv$', views.jukebox_csv, name='jukebox-csv'),
    url(r'^api/user/register$', views.UserCreate.as_view(), name='api-user-create'),
    url(r'^api/user$', views.UserDetail.as_view(), name='api-user-detail'),
    url(r'^api/obtain-token$',
        views.ObtainAuthToken.as_view(), name='api-token-auth'),
    url(r'^api/scheduleitems/$',
        views.ScheduleitemList.as_view(), name='api-scheduleitem-list'),
    url(r'^api/scheduleitems/(?P<pk>\d+)$',
        views.ScheduleitemDetail.as_view(), name='api-scheduleitem-detail'),
    url(r'^api/videofiles/$',
        views.VideoFileList.as_view(), name='api-videofile-list'),
    url(r'^api/videofiles/(?P<pk>\d+)$',
        views.VideoFileDetail.as_view(), name='api-videofile-detail'),
    url(r'^api/organization/$',
        views.OrganizationList.as_view(), name='api-organization-list'),
    url(r'^api/organization/(?P<pk>\d+)$',
        views.OrganizationDetail.as_view(), name='api-organization-detail'),
    url(r'^api/videos/(?P<pk>\d+)/upload_token$',
        views.VideoUploadTokenDetail.as_view(), name='api-video-upload-token-detail'),
]

urlpatterns += router.urls
urlpatterns += video_router.urls


# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns,
                                     allowed=['json', 'api', 'xml'])

# Default login/logout views
urlpatterns += [
    url(r'^api/api-auth/',
        include('rest_framework.urls', namespace='rest_framework'))
]
