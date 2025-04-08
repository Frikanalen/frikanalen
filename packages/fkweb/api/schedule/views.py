import datetime

from zoneinfo import ZoneInfo
from django.core.cache import caches
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache, cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.filters import OrderingFilter

from api.auth.permissions import IsInOrganizationOrReadOnly
from api.schedule.filter import ScheduleitemFilter
from api.schedule.serializers import ScheduleitemModifySerializer, ScheduleitemReadSerializer
from api.views import Pagination
from fk.models import Scheduleitem


@method_decorator(cache_page(60 * 5, key_prefix="schedule"), name="get")
class ScheduleitemList(generics.ListCreateAPIView):
    """
    Video events schedule

    Query parameters
    ----------------

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `surrounding` - Fetch th§e first event before and after the given
                    period

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """

    queryset = Scheduleitem.objects.all()
    pagination_class = Pagination
    permission_classes = (IsInOrganizationOrReadOnly,)
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ScheduleitemFilter
    ordering_fields = ["starttime"]

    # Permit session-based login for backwards compat with old frontend
    # Remove when new planner works!
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_serializer_class(self):
        if hasattr(self.request, "method") and self.request.method in ["POST", "PUT"]:
            return ScheduleitemModifySerializer
        return ScheduleitemReadSerializer





class ScheduleitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Schedule item details
    """

    queryset = Scheduleitem.objects.all()

    def get_serializer_class(self):
        if hasattr(self.request, "method") and self.request.method in ["POST", "PUT"]:
            return ScheduleitemModifySerializer
        return ScheduleitemReadSerializer

    permission_classes = (IsInOrganizationOrReadOnly,)
    # Permit session-based login for backwards compat with old frontend
    # Remove when new planner works!
    authentication_classes = [SessionAuthentication, TokenAuthentication]
