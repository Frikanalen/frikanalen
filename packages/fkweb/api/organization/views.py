from rest_framework import generics

from api.auth.permissions import IsOrganizationEditorOrReadOnly
from api.organization.serializers import OrganizationSerializer
from api.views import Pagination
from fk.models import Organization


class OrganizationList(generics.ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = Pagination
    permission_classes = (IsOrganizationEditorOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(editor=self.request.user)


class OrganizationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = (IsOrganizationEditorOrReadOnly, )