# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
import urllib

from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from django.http import Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.generic import TemplateView

from fk.models import Video, Organization
from fkvod import search


class VideoDetail(TemplateView):
    """Show video and video player to website visitors"""
    def get(self, request, video_id):
        try:
            video = Video.objects.public().get(id=video_id)
            title = u"%s" % unicode(video.name)
        except ObjectDoesNotExist:
            video = None
            title = "Video #%i not found" % int(video_id)
        context = {
            "video": video,
            "title": title
        }
        return render_to_response('fkvod/video_details.html',
            context,
            context_instance=RequestContext(request))


class AbstractVideoList(TemplateView):
    template = 'fkvod/video_list.html'

    def videoset_name(self, *args, **kwargs):
        return "abstract videos"

    def initial_queryset(self, *args, **kwargs):
        """Method that returns videos to browse"""
        pass

    def get(self, request, *args, **kwargs):
        videos = self.initial_queryset(*args, **kwargs)
        videoset_name = self.videoset_name(*args, **kwargs)
        s = request.GET.get("page")
        if str(s).isdigit():
            page_nr = int(s)
        else:
            page_nr = 1

        search_query = request.GET.get("q", "")
        if search_query:
            # This is a search!
            videos = search.search_videos(videos, request)
            title = "Searching %s for %s" % (videoset_name, search_query)
            url_query_postfix = "&q=%s" % urllib.quote(search_query.encode('utf8'))
        else:
            title = videoset_name
            url_query_postfix = ""

        p = Paginator(videos, 30)
        page = p.page(page_nr)
        context = {
            "videos": page.object_list,
            "title": title,
            "page": page,
            # For appending &q=""
            "url_query_postfix": url_query_postfix,
            "search_query": search_query
        }
        return render_to_response(self.template,
                                  context,
                                  context_instance=RequestContext(request))

class VideoList(AbstractVideoList):
    def videoset_name(self):
        return "All videos"

    def initial_queryset(self):
        videos = (Video.objects
                  .public()
                  .filter(proper_import=True)
                  .order_by('-id'))
        return videos


class OrganizationVideos(AbstractVideoList):
    def videoset_name(self, orgid):
        return "Videos from %s" % self.org.name

    def initial_queryset(self, orgid):
        try:
            self.org = Organization.objects.get(id=orgid)
        except ObjectDoesNotExist:
            raise Http404
        videos = (Video.objects
                  .public()
                  .filter(organization=self.org)
                  .order_by('-id'))
        return videos


class RssVideos(AbstractVideoList):
    template = 'fkvod/video_list.rss'

    def videoset_name(self, orgid=None, *args, **kwargs):
        if self.org is not None:
            return "Video RSS from %s" % self.org.name
        else:
            return "Video RSS"

    def initial_queryset(self, orgid=None, *args, **kwargs):
        self.org = None
        if orgid is not None:
            self.org = Organization.objects.get(id=orgid)
            videos = (Video.objects.public().filter(organization=self.org)
                      .order_by('-id'))
        else:
            videos = Video.objects.public().order_by('-id')
        return videos
