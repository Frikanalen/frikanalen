# -*- coding: utf-8 -*-
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf.urls import include
from django.urls import re_path
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import agenda.urls
import api.urls
from fkweb.views import Frontpage

admin.autodiscover()

urlpatterns = [
    re_path(r"^$", Frontpage.as_view(), name="frontpage"),
    re_path(r"^login/$", LoginView.as_view(), name="login"),
    re_path(r"^logout/$", LogoutView.as_view(), {"next_page": "/"}, name="logout"),
    re_path(r"^admin/", admin.site.urls),
]

urlpatterns += agenda.urls.urlpatterns
urlpatterns += api.urls.urlpatterns
urlpatterns += [
    re_path(
        r"^api/news/",
        include(
            (
                "news.urls",
                "news",
            )
        ),
    )
]

# Only used with DEBUG. Serves static content right from source
urlpatterns += staticfiles_urlpatterns()
