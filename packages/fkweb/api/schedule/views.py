import datetime

from django.core.cache import caches
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework import generics
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from zoneinfo import ZoneInfo

from api.auth.permissions import IsInOrganizationOrReadOnly
from api.schedule.serializers import (
    ScheduleitemModifySerializer,
    ScheduleitemReadSerializer,
)
from api.views import Pagination
from fk.models import Scheduleitem


@method_decorator(never_cache, name="get")
class ScheduleitemList(generics.ListCreateAPIView):
    """
    Video events schedule

    Query parameters
    ----------------

    `date` - Date expressed in the format YYYY-MM-DD (eg. 2020-12-31), or
             "today".  Default is today, Europe/Oslo time.

    `days` - Number of days schedule requested. Default is 7 days.

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `surrounding` - Fetch the first event before and after the given
                    period

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """

    queryset = Scheduleitem.objects.all()
    pagination_class = Pagination
    permission_classes = (IsInOrganizationOrReadOnly,)

    # Permit session-based login for backwards compat with old frontend
    # Remove when new planner works!
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_serializer_class(self):
        if hasattr(self.request, "method") and self.request.method in ["POST", "PUT"]:
            return ScheduleitemModifySerializer
        return ScheduleitemReadSerializer

    @staticmethod
    def parse_yyyymmdd_or_today(inputDate):
        try:
            return datetime.datetime.strptime(inputDate, "%Y-%m-%d").astimezone(
                ZoneInfo("Europe/Oslo")
            )
        except (KeyError, ValueError, TypeError):
            return datetime.datetime.now(tz=ZoneInfo("Europe/Oslo"))

    @staticmethod
    def parse_int_or_7(inputDays):
        try:
            return int(inputDays)
        except (KeyError, ValueError, TypeError):
            return 7

    def get_queryset(self):
        params = self.request.query_params
        date = self.parse_yyyymmdd_or_today(params.get("date", None))
        days = self.parse_int_or_7(params.get("days", None))

        # FIXME by_day should be on queryset but need to upgrade
        # django first
        queryset = Scheduleitem.objects.by_day(
            date=date, days=days, surrounding=bool(params.get("surrounding"))
        )

        return queryset.order_by("starttime")

    def get(self, request, *args, **kwargs):
        query_parameters = request.GET

        date = self.parse_yyyymmdd_or_today(query_parameters.get("date", None))
        days = self.parse_int_or_7(query_parameters.get("days", None))

        # The schedule cache is cleared on save() and delete() in fk/models.py:Scheduleitem
        cache = caches["schedule"]
        cache_key = f"schedule-{date.strftime('%Y%m%d')}-{days}"

        # We only cache for the most common use case: Single day of schedule,
        # requested as JSON. If any other parameters are set, we simply disable
        # caching for the remainder of the request.
        cacheable = True
        if (type(request.accepted_renderer).__name__) != "JSONRenderer":
            cacheable = False
        for disqualifying_parameter in ["surrounding", "ordering", "page_size"]:
            if query_parameters.get(disqualifying_parameter, None) != None:
                cacheable = False

        if cacheable:
            cache_res = cache.get(cache_key)

            if cache_res:
                # logger.warning('[Scheduleitem] cache hit')
                return cache_res
            else:
                # logger.warning('[Scheduleitem] cache miss, cache_key=%s', cache_key)
                pass
        else:
            pass
            # logger.warning('[Scheduleitem] not caching')

        res = super().get(request, *args, **kwargs)
        res.accepted_renderer = request.accepted_renderer
        res.accepted_media_type = request.accepted_media_type
        res.renderer_context = self.get_renderer_context()
        res.render()

        if cacheable and res.status_code == 200:
            # logger.warning('[Scheduleitem] cache store, cache_key=%s', cache_key)
            cache.set(cache_key, res, None)

        return res


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
