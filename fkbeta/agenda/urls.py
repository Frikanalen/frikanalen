from django.conf.urls.defaults import *
import views

urlpatterns = patterns('',
    url(r'^guide/', views.ProgramguideView.as_view(), name='guide'),
    url(r'^members/video/new/$', views.ManageVideoNew.as_view(), name='manage_video_new'),
    url(r'^members/video/edit/(?P<id>[0-9]+)$', views.ManageVideoEdit.as_view(), name='manage_video_edit'),
	)