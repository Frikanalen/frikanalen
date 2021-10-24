from .models import Bulletin
from .serializers import BulletinSerializer
from api.auth.permissions import IsStaffOrReadOnly

from rest_framework import viewsets

class BulletinViewSet(viewsets.ModelViewSet):
    queryset = Bulletin.objects.all().order_by('-created')
    serializer_class = BulletinSerializer
    permission_classes = (IsStaffOrReadOnly,)
    pagination_class = None
