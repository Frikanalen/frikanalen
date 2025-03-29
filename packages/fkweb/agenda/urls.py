# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.urls import re_path as url

from agenda import views

urlpatterns = [
    url(r"^guide/", views.ProgramguideView.as_view(), name="guide"),
    url(r"^calendar/$", views.ProgramguideCalendarView.as_view(), name="calendar"),
    url(r"^members/plan/$", views.ProgramplannerView.as_view(), name="manage-schedule"),
    url(r"^members/video/$", views.ManageVideoList.as_view(), name="manage-video-list"),
    url(r"^members/video/new/$", views.ManageVideoNew.as_view(), name="manage-video-new"),
    url(
        r"^members/video/edit/(?P<id>[0-9]+)$",
        views.ManageVideoEdit.as_view(),
        name="manage-video-edit",
    ),
    url(r"^xmltv/$", views.xmltv_home, name="xmltv-home"),
    url(r"^xmltv/upcoming/$", views.xmltv_upcoming, name="xmltv-feed-upcoming"),
    url(
        r"^xmltv/(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/?$",
        views.xmltv_date,
        name="xmltv-feed",
    ),
]
