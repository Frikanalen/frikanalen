# -*- coding: utf-8 -*-
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

import agenda.urls
import fkvod.urls
import fkws.urls
from fk.views import register, user_profile
from fkbeta.views import Frontpage


admin.autodiscover()

urlpatterns = [
    url(r'^$', Frontpage.as_view(), name='frontpage'),
    url(r'^register/$', register, name='register'),
    url(r'^login/$', login, name='login'),
    url(r'^user/$', user_profile, name='profile'),
    url(r'^logout/$', logout, {'next_page': '/'}, name='logout'),

    url(r'^member/', include('fkprofile.urls')),
    url(r'^admin/', include(admin.site.urls)),
]

urlpatterns += agenda.urls.urlpatterns
urlpatterns += fkvod.urls.urlpatterns
urlpatterns += fkws.urls.urlpatterns

# Only used with DEBUG. Serves static content right from source
urlpatterns += staticfiles_urlpatterns()
