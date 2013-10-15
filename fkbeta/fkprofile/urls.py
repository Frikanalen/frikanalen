from django.conf.urls import patterns, include, url
from fkprofile.views import ProfileDetailView

urlpatterns = patterns('',
        url(r'^(?P<pk>\w+)/$', ProfileDetailView.as_view(), name='profile_view'),
        )
