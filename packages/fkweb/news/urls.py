from django.urls import include, path
from rest_framework import routers
from .views import BulletinViewSet

router = routers.DefaultRouter()
router.register(r'bulletins', BulletinViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
