# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.urls import re_path

from agenda import views

urlpatterns = [
    re_path(r"^guide/", views.ProgramguideView.as_view(), name="guide"),
    re_path(r"^calendar/$", views.ProgramguideCalendarView.as_view(), name="calendar"),
    re_path(r"^members/plan/$", views.ProgramplannerView.as_view(), name="manage-schedule"),
    re_path(r"^members/video/$", views.ManageVideoList.as_view(), name="manage-video-list"),
    re_path(r"^members/video/new/$", views.ManageVideoNew.as_view(), name="manage-video-new"),
    re_path(
        r"^members/video/edit/(?P<id>[0-9]+)$",
        views.ManageVideoEdit.as_view(),
        name="manage-video-edit",
    ),
    re_path(r"^xmltv/$", views.xmltv_home, name="xmltv-home"),
    re_path(r"^xmltv/upcoming/$", views.xmltv_upcoming, name="xmltv-feed-upcoming"),
    re_path(
        r"^xmltv/(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/?$",
        views.xmltv_date,
        name="xmltv-feed",
    ),
]
