from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import TemplateView
from fk.models import Scheduleitem
import datetime

from django.utils.timezone import utc

class ProgramguideView(TemplateView):
  """Simple Programguide

  It's quite slow.

  Improvement would be to give out days presorted as days to facilitate 
  flowing formatting. 
  """
  def get(self, request, form = None):
    starttime = datetime.datetime.utcnow().replace(tzinfo=utc).date()
    events = Scheduleitem.objects.by_day(starttime, days=7).order_by("starttime")
    context = {
        'events': events,
        'title': 'Program Guide - This week'
      }
    return render_to_response('agenda/events.html', 
      context, 
      context_instance=RequestContext(request))
