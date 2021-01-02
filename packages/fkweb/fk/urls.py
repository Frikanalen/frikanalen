# -*- coding: utf-8 -*-

from django.conf.urls import url

from fk.views import member_organizations_list

urlpatterns = [
    url(r'^organization/$', member_organizations_list, name='organization-list'),
]
