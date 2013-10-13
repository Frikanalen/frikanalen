# -*- coding: utf-8 -*-
# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required

# Enable the admin:
from django.contrib import admin
admin.autodiscover()
urlpatterns = patterns('', (r'^admin/', include(admin.site.urls)))

# Only used with DEBUG. Serves static content right from source
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()

# Add pages from agenda.
import agenda.urls
urlpatterns += agenda.urls.urlpatterns

# Add public vod pages
import fkvod.urls
urlpatterns += fkvod.urls.urlpatterns

# Add webservices
import fkws.urls
urlpatterns += fkws.urls.urlpatterns

# Add user authentication/management views
from django.contrib.auth.views import login, logout
from fk.views import register, user_profile

urlpatterns += patterns('',
        url(r'^register/$', register, name='register'),
        url(r'^login/$', login, name='login'),
        url(r'^user/$', user_profile, name='profile'),
        url(r'^logout/$', logout, {'next_page': '/'}, name='logout'),
        )

from fknews.views import Frontpage

urlpatterns += patterns('',
    url(r'^$', Frontpage.as_view(), name="frontpage"),
    )
