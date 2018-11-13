from django.conf.urls import url

from fkprofile.views import member_organizations_list, ProfileDetailView


urlpatterns = [
    url(r'^$', member_organizations_list, name='member-org-list'),
    url(r'^(?P<pk>\w+)/$', ProfileDetailView.as_view(), name='profile-view'),
]
