from django.conf.urls import include
from django.conf.urls import url

from create import views

urlpatterns = [
    url(r'^$', views.home),
]
