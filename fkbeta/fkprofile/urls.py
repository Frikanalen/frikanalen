from django.conf.urls import url

from fkprofile.views import ProfileDetailView


urlpatterns = [
    url(r'^(?P<pk>\w+)/$', ProfileDetailView.as_view(), name='profile-view'),
]
