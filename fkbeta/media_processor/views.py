# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import datetime
import logging

from django.conf import settings
from django.core.paginator import Paginator
from django.forms import ModelForm
from django.shortcuts import render
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.utils import timezone
from django.views.generic import TemplateView

from fk.models import Video
from media_processor.models import MediaUpload


logger = logging.getLogger(__name__)

import zmq
zmqctx = zmq.Context()
pub_socket = zmqctx.socket(zmq.PUB)
pub_socket.connect("tcp://localhost:11000")

class MediaUploadsView(TemplateView):
  template_name = 'agenda/media_processor_uploads.html'
  title = 'Uploads'

  def get(self, request):
    if not request.user.is_authenticated():
      return redirect('/login/?next=%s' % request.path)
    context = {}
    context["title"] = self.title
    uploads = MediaUpload.objects.filter(uploader=request.user).order_by('last_write_at')

    p = Paginator(uploads, 20)
    s = request.GET.get("page")
    if str(s).isdigit():
      page_nr = int(s)
    else:
      page_nr = 1
    page = p.page(page_nr)

    context["uploads"] = page.object_list
    context["page"] = page
    return render_to_response(self.template_name,
      context,
      context_instance=RequestContext(request))

  def post(self, request):
    if not request.user.is_authenticated():
      return redirect('/login/?next=%s' % request.path)
    try:
      upload_id = int(request.POST["upload_id"])
    except ValueError:      
      # Something went wrong
      return self.get(request)
    try:
      video_id = int(request.POST["video_id"])
    except ValueError:      
      # Something went wrong
      return self.get(request)
    upload = MediaUpload.objects.get(id=upload_id, uploader=request.user)
    video = Video.objects.get(id=video_id, editor=request.user)
    print upload.filename
    print video.name
    pub_socket.send_multipart(["no.frikanalen.dev.fkftp.ingest",'{"msg": {"action": "ingest", "upload_id": %i, "video_id": %i} }' % (upload.id, video.id)])
    return self.get(request)


