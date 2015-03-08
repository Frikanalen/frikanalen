import datetime
import math

from django import template


register = template.Library()


@register.filter
def truncate_duration(timedelta):
    seconds = math.ceil(timedelta.total_seconds())
    return str(datetime.timedelta(seconds=seconds))
