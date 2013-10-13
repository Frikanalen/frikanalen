# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from fk.models import Scheduleitem, Video, VideoFile
import fkvod.search
from fkws.serializers import ScheduleitemSerializer, VideoSerializer, VideoFileSerializer
import datetime

@api_view(['GET'])
def api_root(request, format=None):
    """The root of the FK API / web services
    """
    return Response({
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videos': reverse('api-video-list', request=request),
        'videofiles': reverse('api-videofile-list', request=request),
    })

class ScheduleitemList(generics.ListCreateAPIView):
    """Video events schedule

        HTTP parameters:
        * date
            Year, Month, Day as digits, for example ...?date=20130130
            "today", for example ...?date=today

        * days
            If date is specified, how many days to return, for example, ...?date=today&days=7
            Default is 7 days.

        * page_size
            How many items per page. If set to 0 it will list all items.
            Default is 50 items.

        * surrounding
            Fetch the first event before and after the given period
    """
    model = Scheduleitem
    serializer_class = ScheduleitemSerializer
    paginate_by = 50
    paginate_by_param = 'page_size'

    def get_queryset(self):
        date_string = self.request.QUERY_PARAMS.get('date', "today")
        days_string = self.request.QUERY_PARAMS.get('days', "7")
        surrounding = self.request.QUERY_PARAMS.get('surrounding', False)
        if date_string is not None:
            if days_string.isdigit():
                days = int(days_string)
            else:
                days = 1
            if date_string.isdigit():
                date = datetime.datetime.strptime(date_string, "%Y%m%d")
            elif date_string == "today":
                date = datetime.date.today()
            queryset = self.model.objects.by_day(date=date, days=days, surrounding=surrounding)
        else:
            queryset = self.model.objects.all()
        return queryset.order_by("starttime")

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemList, self).post(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemList, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemList, self).patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemList, self).delete(request, *args, **kwargs)

class ScheduleitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """Schedule item details
    """
    model = Scheduleitem
    serializer_class = ScheduleitemSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemDetail, self).post(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemDetail, self).patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(ScheduleitemDetail, self).delete(request, *args, **kwargs)


class VideoList(generics.ListAPIView):
    """Video list

        HTTP parameters:
        * q
            Free search query.
        * page_size
            How many items per page. If set to 0 it will list all items.
            Default is 50 items.
    """
    model = Video
    serializer_class = VideoSerializer
    paginate_by = 50
    paginate_by_param = 'page_size'

    def get_queryset(self):
        queryset = self.model.objects.filter(proper_import=True)
        search_query = self.request.QUERY_PARAMS.get('q', None)
        if search_query:
            queryset = fkvod.search.search_videos(queryset, query=search_query)
        return queryset

class VideoDetail(generics.RetrieveAPIView):
    """Video details
    """
    model = Video
    serializer_class = VideoSerializer

class VideoFileList(generics.ListCreateAPIView):
    """Video file list

        HTTP parameters:
        * video_id
            The video by ID
        * page_size
            How many items per page. If set to 0 it will list all items.
            Default is 50 items.
    """
    model = VideoFile
    serializer_class = VideoFileSerializer
    paginate_by = 50
    paginate_by_param = 'page_size'

    def get_queryset(self):
        queryset = self.model.objects.all()
        video_id = self.request.QUERY_PARAMS.get('video_id', None)
        if not (video_id == None):
               queryset = queryset.filter(video_id = video_id)
        return queryset

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileList, self).post(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileList, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileList, self).patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileList, self).delete(request, *args, **kwargs)

class VideoFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """Video file details
    """
    model = VideoFile
    serializer_class = VideoFileSerializer

    def post(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileDetail, self).post(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileDetail, self).put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileDetail, self).patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super(VideoFileDetail, self).delete(request, *args, **kwargs)

def wschange_redirect_view(request, path):
    if request.META['QUERY_STRING']:
        path += '?%s' % request.META['QUERY_STRING']
    return redirect('/api/' + path, permanent=True)
