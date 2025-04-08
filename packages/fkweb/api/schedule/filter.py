import django_filters

from fk.models import Scheduleitem


class ScheduleitemFilter(django_filters.FilterSet):
    starttime = django_filters.filters.IsoDateTimeFromToRangeFilter()

    class Meta:
        model = Scheduleitem
        fields = {
        }
