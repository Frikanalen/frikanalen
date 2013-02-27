from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import TemplateView
from fk.models import Scheduleitem
import datetime

from django.utils.timezone import is_naive

class ProgramguideView(TemplateView):
  """Simple Programguide

  It's quite slow.

  Improvement would be to give out days presorted as days to facilitate 
  flowing formatting. 
  """
  def get(self, request, form = None):
    starttime = datetime.date.today()
    events = Scheduleitem.objects.by_day(starttime, days=7)
    context = {
        'events': events,
        'title': 'Program Guide - This week'
        #"title": u"'%s'" % unicode(str(starttime) + '-' + str(endtime))
      }

    return render_to_response('agenda/events.html', 
      context, 
      context_instance=RequestContext(request))
