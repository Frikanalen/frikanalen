# -*- coding: utf-8 -*-

from django.conf.urls import url

from fk.views import member_organizations_list, user_profile


urlpatterns = [
    url(r'^user/$', user_profile, name='profile'),
    url(r'^organization/$', member_organizations_list, name='organization-list'),
]
