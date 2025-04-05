# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.urls import re_path as url
from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework.urlpatterns import format_suffix_patterns
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

import api.auth.views
import api.organization.views
import api.schedule.views
import api.video.views
import api.videofile.views
from . import views

router = SimpleRouter()
router.register(r"api/asrun", views.AsRunViewSet)
router.register(r"api/categories", views.CategoryViewSet)

urlpatterns = [
    url(r"^api/$", views.api_root, name="api-root"),
    url(r"^api/jukebox_csv$", views.jukebox_csv, name="jukebox-csv"),
    url(r"^api/user/register$", api.auth.views.UserCreate.as_view(), name="api-user-create"),
    url(r"^api/user/login$", api.auth.views.UserLogin.as_view(), name="api-user-login"),
    url(r"^api/user/logout$", api.auth.views.UserLogout.as_view(), name="api-user-logout"),
    url(r"^api/user$", api.auth.views.UserDetail.as_view(), name="api-user-detail"),
    url(r"^api/obtain-token$", api.auth.views.ObtainAuthToken.as_view(), name="api-token-auth"),
    url(
        r"^api/scheduleitems/$",
        api.schedule.views.ScheduleitemList.as_view(),
        name="api-scheduleitem-list",
    ),
    url(
        r"^api/scheduleitems/(?P<pk>\d+)$",
        api.schedule.views.ScheduleitemDetail.as_view(),
        name="api-scheduleitem-detail",
    ),
    url(r"^api/videos/$", api.video.views.VideoList.as_view(), name="api-video-list"),
    url(
        r"^api/videos/(?P<pk>\d+)/upload_token$",
        api.video.views.VideoUploadTokenDetail.as_view(),
        name="api-video-upload-token-detail",
    ),
    url(
        r"^api/videos/(?P<pk>\d+)$", api.video.views.VideoDetail.as_view(), name="api-video-detail"
    ),
    url(
        r"^api/videofiles/$", api.videofile.views.VideoFileList.as_view(), name="api-videofile-list"
    ),
    url(
        r"^api/videofiles/(?P<pk>\d+)$",
        api.videofile.views.VideoFileDetail.as_view(),
        name="api-videofile-detail",
    ),
    url(
        r"^api/organization/$",
        api.organization.views.OrganizationList.as_view(),
        name="api-organization-list",
    ),
    url(
        r"^api/organization/(?P<pk>\d+)$",
        api.organization.views.OrganizationDetail.as_view(),
        name="api-organization-detail",
    ),
    # Spectacular API views
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

urlpatterns += router.urls

# Format suffixes
urlpatterns = format_suffix_patterns(urlpatterns, allowed=["json", "api", "xml"])

# Default login/logout views
urlpatterns += [url(r"^api/api-auth/", include("rest_framework.urls", namespace="rest_framework"))]
