from django.conf.urls.defaults import *
import views

urlpatterns = patterns('',
    url(r'^guide/', views.ProgramguideView.as_view(), name='guide'),
	)