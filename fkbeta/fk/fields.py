from django.db.models import IntegerField
from django.db import models
from fk.widgets import MillisecondWidget
from fkutils import timeutils
import datetime

from django.forms.fields import CharField
from django.forms.util import ValidationError as FormValidationError
from django.forms.util import ValidationError

class FramesField(IntegerField):
    pass

class MillisecondFormField(CharField):
    widget = MillisecondWidget
    def __init__(self, *args, **kwargs):
        self.max_length = 14
        super(MillisecondFormField, self).__init__(*args, **kwargs)

    def clean(self, value):
        value = super(CharField, self).clean(value)
        try:
            timeutils.parse_to_millisec(value)
        except TypeError as e:
            raise FormValidationError(e)
        return value

class MillisecondField(IntegerField):
    __metaclass__ = models.SubfieldBase
    widget = MillisecondWidget
    def __init__(self, *args, **kwargs):
        super(MillisecondField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        if not value:
            return None
        elif isinstance(value, (int, long)):
            return timeutils.TimeDeltaWrapper(microseconds=value*1000)
        elif isinstance(value, basestring):
            milliseconds = timeutils.parse_to_millisec(value)
            return timeutils.TimeDeltaWrapper(microseconds=milliseconds*1000)
        elif isinstance(value, (datetime.timedelta, timeutils.TimeDeltaWrapper)):
            return value
        raise ValidationError('Unable to convert %s to timedelta.' % value)

    def get_db_prep_value(self, value, connection, prepared):
        milliseconds = ((value.days * (24*60*60)) + value.seconds)*1000 + value.microseconds / 1000
        return milliseconds

    def value_to_string(self, instance):
        timedelta = getattr(instance, self.name)
        if timedelta:   
            s = timeutils.timedelta_to_string(timedelta)
            return s

    def formfield(self, **kwargs):
        defaults = {
            "help_text": "Enter in the format: HH:MM:SS",
            }
        defaults.update(kwargs)
        defaults.update({
            #'form_class': FramesFormField,           
            'widget': self.widget, 
            })
        return MillisecondFormField(**defaults) #super(FramesField, self).formfield(**defaults)

try:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^fk\.fields\.MillisecondField"])
except ImportError:
    pass