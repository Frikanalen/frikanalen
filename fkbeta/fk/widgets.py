# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import django.forms as forms
from string import Template
from django.utils.safestring import mark_safe
from fkutils import timeutils
import datetime

class MillisecondWidget(forms.TextInput):
  """Widget for duration.

  TODO: Rename to duration
  """
  input_type = "frames"
  def render(self, name, value, attrs=None):
	render = super(MillisecondWidget, self).render(name, value, attrs)
	tpl = Template(u"""<input type="text" name="$name" id="$id" value="$value"> </input>""")
	if value == None:
		value = datetime.timedelta(seconds=0)
	if isinstance(value, datetime.timedelta):
		s = timeutils.timedelta_to_string(value)
	else:
		s = value
	return mark_safe(tpl.substitute(value=s, name=name, id=attrs["id"]))