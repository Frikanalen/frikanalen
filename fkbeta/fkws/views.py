# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

import datetime

from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.reverse import reverse

import fkvod.search
from fk.models import Scheduleitem, Video, VideoFile
from fkws.permissions import IsInOrganizationOrReadOnly
from fkws.serializers import ScheduleitemSerializer
from fkws.serializers import VideoFileSerializer
from fkws.serializers import VideoSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """
    The root of the FK API / web services
    """
    return Response({
        'obtain-token': reverse('api-token-auth', request=request),
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videos': reverse('api-video-list', request=request),
        'videofiles': reverse('api-videofile-list', request=request),
    })


class ObtainAuthToken(generics.RetrieveAPIView):
    """
    Get a token you can use as a header instead of basic auth.

    Use the header with HTTP like:
        Authorization: Token 000000000000...
    """
    model = Token
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return get_object_or_404(Token, user=self.request.user)


class ScheduleitemList(generics.ListCreateAPIView):
    """
    Video events schedule

    HTTP parameters:
    * date
        Year, Month, Day as digits, for example ...?date=20130130
        "today", for example ...?date=today
        Default is today.

    * days
        If date is specified, how many days to return, for example,
            ...?date=today&days=7
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
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        params = self.request.QUERY_PARAMS
        try:
            days = int(params['days'])
        except (KeyError, ValueError):
            days = 7
        try:
            date = datetime.datetime.strptime(params['date'], '%Y%m%d')
        except (KeyError, ValueError):
            date = datetime.date.today()
        queryset = self.model.objects.by_day(
            date=date, days=days, surrounding=bool(params.get('surrounding')))
        return queryset.order_by('starttime')


class ScheduleitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Schedule item details
    """
    model = Scheduleitem
    serializer_class = ScheduleitemSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


class VideoList(generics.ListAPIView):
    """
    Video list

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
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        queryset = self.model.objects.filter(proper_import=True)
        search_query = self.request.QUERY_PARAMS.get('q')
        if search_query:
            queryset = fkvod.search.search_videos(queryset,
                                                  query=search_query)
        return queryset


class VideoDetail(generics.RetrieveAPIView):
    """
    Video details
    """
    model = Video
    serializer_class = VideoSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


class VideoFileList(generics.ListCreateAPIView):
    """
    Video file list

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
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        queryset = self.model.objects.all()
        video_id = self.request.QUERY_PARAMS.get('video_id')
        if video_id is not None:
            queryset = queryset.filter(video_id=video_id)
        return queryset


class VideoFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    model = VideoFile
    serializer_class = VideoFileSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


def wschange_redirect_view(request, path):
    if request.META['QUERY_STRING']:
        path += '?%s' % request.META['QUERY_STRING']
    return redirect('/api/' + path, permanent=True)
