import django_filters
from datetime import datetime
from zoneinfo import ZoneInfo

from fk.models import Scheduleitem


class ScheduleitemFilter(django_filters.FilterSet):
    date = django_filters.CharFilter(method="filter_by_date")
    days = django_filters.NumberFilter(method="filter_by_days")
    surrounding = django_filters.BooleanFilter(method="filter_by_surrounding")

    class Meta:
        model = Scheduleitem
        fields = {
            "starttime": ["lt", "gt"]
        }

    def filter_by_date(self, queryset, name, value):
        try:
            date = datetime.strptime(value, "%Y-%m-%d").astimezone(ZoneInfo("Europe/Oslo"))
        except Exception:
            date = datetime.now(tz=ZoneInfo("Europe/Oslo"))

        # Store in context so other filters (like days) can use it
        self._date = date
        return queryset

    def filter_by_days(self, queryset, name, days: int):
        days = days if isinstance(days, int) else 7
        date = getattr(self, "_date", datetime.now(tz=ZoneInfo("Europe/Oslo")))
        return Scheduleitem.objects.by_day(
            date=date, days=days, surrounding=self.request.GET.get("surrounding") is not None
        )

    def filter_by_surrounding(self, queryset, name, value):
        # Just passthrough, actual logic handled in `filter_by_days`
        return queryset
