# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import datetime
import logging

from django.core.paginator import Paginator
from django.forms import ModelForm
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.utils.timezone import utc
from django.views.generic import TemplateView

from fk.models import Scheduleitem, Video, Organization

logger = logging.getLogger(__name__)

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

class ProgramplannerView(TemplateView):
  def get(self, request, form = None):
    context = {
        #'events': events,
        'title': 'Schedule planner'
      }
    return render_to_response('agenda/planner.html',
      context,
      context_instance=RequestContext(request))

class ManageVideoList(TemplateView):
  def get(self, request):
    if not request.user.is_authenticated():
      return redirect('/login/?next=%s' % request.path)
    context = {}
    context["title"] = "My videos"
    videos = Video.objects.filter(editor=request.user).order_by('name')

    p = Paginator(videos, 20)
    s = request.GET.get("page")
    if str(s).isdigit():
      page_nr = int(s)
    else:
      page_nr = 1
    page = p.page(page_nr)

    context["videos"] = page.object_list
    context["page"] = page
    return render_to_response('agenda/manage_video_list.html',
      context,
      context_instance=RequestContext(request))

class VideoFormForUsers(ModelForm):
  #organization = ModelChoiceField(queryset=Organization.objects.filter(name="Frikanalen"))
  class Meta:
    model = Video
    exclude = ("editor", "framerate", "played_count_web", "description", "proper_import", "updated_time", "uploaded_time")

class VideoFormForAdmin(ModelForm):
  class Meta:
    model = Video
    exclude = ("framerate", "played_count_web", "description", "proper_import", "updated_time", "uploaded_time")

class AbstractVideoFormView(TemplateView):
  UserForm = VideoFormForUsers
  AdminForm = VideoFormForAdmin

  def get_form(self, request, data=None, initial={}, form=None, instance=None):
    # I suspect this stuff should be moved to the VideoForm-class
    organizations = Organization.objects.filter(members=request.user.id)
    if not form:
      if not instance:
        if organizations:
          initial["organization"] = organizations[0].id
        initial["publish_on_web"] = True
        initial["is_filler"] = True

      if request.user.is_superuser:
        initial["editor"] = request.user.id
        if not instance:
          form = self.AdminForm(initial=initial)
        else:
          form = self.AdminForm(data, instance=instance)
      else:
        if not instance:
          form = self.UserForm(initial=initial)
        else:
          form = self.UserForm(data, instance=instance)

    if not request.user.is_superuser:
      form.fields["organization"].queryset=organizations
    return form

class ManageVideoNew(AbstractVideoFormView):
  def get(self, request, form=None):
    if not request.user.is_authenticated() or not request.user.is_superuser:
      return redirect('/login/?next=%s' % request.path)
    initial = {}
    form = self.get_form(request, initial=initial, form=form)
    context = {
               "form": form,
               "title": u"New Video"
               }
    return render_to_response('agenda/manage_video_new.html',
      context,
      context_instance=RequestContext(request))

  def post(self, request):
    if not request.user.is_authenticated() or not request.user.is_superuser:
      return redirect('/login/?next=%s' % request.path)
    if request.user.is_superuser:
      video = Video()
    else:
      video = Video(editor=request.user)
    form = self.get_form(request, data=request.POST, instance=video)
    if form.is_valid():
      video = form.save()
      # Success, send to edit page
      return redirect("manage_video_edit", video.id)
    return self.get(request, form=form)

class ManageVideoEdit(AbstractVideoFormView):
  Form = VideoFormForUsers
  def get(self, request, id=None, form=None):
    if not request.user.is_authenticated() or not request.user.is_superuser:
      return redirect('/login/?next=%s' % request.path)
    video = Video.objects.get(id=id)
    form = self.get_form(request, form=form, instance=video)
    context = {
               "form": form,
               "title": u"Edit video"
               }
    return render_to_response('agenda/manage_video_new.html',
      context,
      context_instance=RequestContext(request))

  def post(self, request, id):
    if not request.user.is_authenticated() or not request.user.is_superuser:
      return redirect('/login/?next=%s' % request.path)
    video = Video.objects.get(id=id)
    form = self.get_form(request, data=request.POST, instance=video)
    if form.is_valid():
      form.save()
    return self.get(request, id=id, form=form)

def fill_next_weeks_agenda():
    from fk.models import WeeklySlot
    slots = WeeklySlot.objects.all()
    for slot in slots:
        if not slot.purpose:
            logger.info("No purpose connected, so nothing to fill")
            continue
        video = slot.purpose.single_video(slot.duration)
        if not video:
            logger.info("Couldn't get a video to use in slot!")
            continue
        next_datetime = slot.next_datetime()
        end_next_datetime = next_datetime + slot.duration

        if Scheduleitem.objects.filter(
                starttime__gte=next_datetime,
                starttime__lt=end_next_datetime).exists():
            # Ouch we have already scheduled something in the slot
            logger.debug("Already something scheduled in this slot")
            continue
        item = Scheduleitem(
                  video=video,
                  schedulereason=4,
                  starttime=next_datetime,
                  duration=video.duration)
        item.save()
