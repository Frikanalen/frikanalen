# -*- coding: utf-8 -*-
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import agenda.urls
import fkvod.urls
import fkws.urls
from fk.views import register
from fkbeta.views import Frontpage
from fkvod.views import csp_report

admin.autodiscover()

urlpatterns = [
    url(r'^$', Frontpage.as_view(), name='frontpage'),
    url(r'^csp-report$', csp_report, name='vod-csp-report'),

    url(r'^register/$', register, name='register'),
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), {'next_page': '/'}, name='logout'),

    url(r'^create/', include('create.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^', include('fk.urls')),
]

urlpatterns += agenda.urls.urlpatterns
urlpatterns += fkvod.urls.urlpatterns
urlpatterns += fkws.urls.urlpatterns

# Only used with DEBUG. Serves static content right from source
urlpatterns += staticfiles_urlpatterns()
