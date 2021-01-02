from .models import Bulletin
from .serializers import BulletinSerializer
from api.permissions import IsStaffOrReadOnly
from django.shortcuts import render

from rest_framework import viewsets

class BulletinViewSet(viewsets.ModelViewSet):
    queryset = Bulletin.objects.all().order_by('-created')
    serializer_class = BulletinSerializer
    permission_classes = (IsStaffOrReadOnly,)
    pagination_class = None
