# -*- coding: utf-8 -*-
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import agenda.urls
import api.urls
import news.urls
from fkweb.views import Frontpage

admin.autodiscover()

urlpatterns = [
    url(r"^$", Frontpage.as_view(), name="frontpage"),
    url(r"^login/$", LoginView.as_view(), name="login"),
    url(r"^logout/$", LogoutView.as_view(), {"next_page": "/"}, name="logout"),
    url(r"^admin/", admin.site.urls),
]

urlpatterns += agenda.urls.urlpatterns
urlpatterns += api.urls.urlpatterns
urlpatterns += [
    url(
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
