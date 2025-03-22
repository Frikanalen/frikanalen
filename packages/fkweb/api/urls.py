# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.urls import include, path, re_path
from rest_framework.routers import SimpleRouter
from rest_framework.urlpatterns import format_suffix_patterns
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from csp.decorators import csp_exempt

import api.auth.views
import api.organization.views
import api.schedule.views
import api.video.views
import api.videofile.views
from . import views

router = SimpleRouter()
router.register(r'api/asrun', views.AsRunViewSet)
router.register(r'api/categories', views.CategoryViewSet)

urlpatterns = [
    re_path(r'^api/$', views.api_root, name='api-root'),
    re_path(r'^api/jukebox_csv$', views.jukebox_csv, name='jukebox-csv'),
    re_path(r'^api/user/register$',
            api.auth.views.UserCreate.as_view(),
            name='api-user-create'),
    re_path(r'^api/user/login$',
            api.auth.views.UserLogin.as_view(),
            name='api-user-login'),
    re_path(r'^api/user/logout$',
            api.auth.views.UserLogout.as_view(),
            name='api-user-logout'),
    re_path(r'^api/user$',
            api.auth.views.UserDetail.as_view(),
            name='api-user-detail'),
    re_path(r'^api/obtain-token$',
            api.auth.views.ObtainAuthToken.as_view(),
            name='api-token-auth'),
    re_path(r'^api/scheduleitems/$',
            api.schedule.views.ScheduleitemList.as_view(),
            name='api-scheduleitem-list'),
    re_path(r'^api/scheduleitems/(?P<pk>\d+)$',
            api.schedule.views.ScheduleitemDetail.as_view(),
            name='api-scheduleitem-detail'),
    re_path(r'^api/videos/$',
            api.video.views.VideoList.as_view(),
            name='api-video-list'),
    re_path(r'^api/videos/(?P<pk>\d+)/upload_token$',
            api.video.views.VideoUploadTokenDetail.as_view(),
            name='api-video-upload-token-detail'),
    re_path(r'^api/videos/(?P<pk>\d+)$',
            api.video.views.VideoDetail.as_view(),
            name='api-video-detail'),
    re_path(r'^api/videofiles/$',
            api.videofile.views.VideoFileList.as_view(),
            name='api-videofile-list'),
    re_path(r'^api/videofiles/(?P<pk>\d+)$',
            api.videofile.views.VideoFileDetail.as_view(),
            name='api-videofile-detail'),
    re_path(r'^api/organization/$',
            api.organization.views.OrganizationList.as_view(),
            name='api-organization-list'),
    re_path(r'^api/organization/(?P<pk>\d+)$',
            api.organization.views.OrganizationDetail.as_view(),
            name='api-organization-detail'),

    # Spectacular API views
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/',
         csp_exempt(SpectacularSwaggerView.as_view(url_name='schema')),
         name='swagger-ui'),
    path('api/schema/redoc/',
         csp_exempt(SpectacularRedocView.as_view(url_name='schema')),
         name='redoc'),
]

urlpatterns += router.urls

# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns,
                                     allowed=['json', 'api', 'xml'])

# Default login/logout views
urlpatterns += [
    re_path(r'^api/api-auth/',
            include('rest_framework.urls', namespace='rest_framework'))
]
