# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

import datetime

from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from rest_framework import filters
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse

import fkvod.search
from fk.models import AsRun
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import VideoFile
from fkws.permissions import IsInOrganizationOrReadOnly
from fkws.permissions import IsStaffOrReadOnly
from fkws.serializers import AsRunSerializer
from fkws.serializers import ScheduleitemSerializer
from fkws.serializers import TokenSerializer
from fkws.serializers import VideoFileSerializer
from fkws.serializers import VideoSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """
    The root of the FK API / web services
    """
    return Response({
        'asrun': reverse('asrun-list', request=request),
        'obtain-token': reverse('api-token-auth', request=request),
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videofiles': reverse('api-videofile-list', request=request),
        'videos': reverse('api-video-list', request=request),
    })


class ObtainAuthToken(generics.RetrieveAPIView):
    """
    Get a token you can use as a header instead of basic auth.

    Use the header with HTTP like:
        Authorization: Token 000000000000...
    """
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return get_object_or_404(Token, user=self.request.user)


class AsRunViewSet(viewsets.ModelViewSet):
    """
    Query parameters
    ----------------

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `ordering` - You can order the results by any visible field.
                 Prepend a minus to order in descending order.  I.e.
                 `?ordering=-played_at` to show newest items first.
    """
    __doc__ = AsRun.__doc__ + __doc__

    queryset = AsRun.objects.all()
    serializer_class = AsRunSerializer
    filter_backends = (filters.OrderingFilter,)
    paginate_by = 50
    paginate_by_param = 'page_size'
    permission_classes = (IsStaffOrReadOnly,)


class ScheduleitemList(generics.ListCreateAPIView):
    """
    Video events schedule

    Query parameters
    ----------------

    `date` - YearMonthDay as digits, for example `?date=20130130` or
             "today", for example `?date=today`.  Default is today.

    `days` - How many days to return, for example, `?days=7`.
             Default is 7 days.

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `surrounding` - Fetch the first event before and after the given
                    period

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """
    queryset = Scheduleitem.objects.all()
    serializer_class = ScheduleitemSerializer
    filter_backends = (filters.OrderingFilter,)
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
        # by_day should be on queryset but need to upgrade
        # django first
        queryset = Scheduleitem.objects.by_day(
            date=date, days=days, surrounding=bool(params.get('surrounding')))
        return queryset.order_by('starttime')


class ScheduleitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Schedule item details
    """
    queryset = Scheduleitem.objects.all()
    serializer_class = ScheduleitemSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


class VideoList(generics.ListCreateAPIView):
    """
    List of videos

    Query parameters
    ----------------

    `q` - Free search query.

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-id`.
    """
    queryset = Video.objects.filter(proper_import=True)
    serializer_class = VideoSerializer
    filter_backends = (filters.OrderingFilter,)
    paginate_by = 50
    paginate_by_param = 'page_size'
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        queryset = self.queryset
        search_query = self.request.QUERY_PARAMS.get('q')
        if search_query:
            queryset = fkvod.search.search_videos(queryset,
                                                  query=search_query)
        return queryset


class VideoDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video details
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


class VideoFileList(generics.ListCreateAPIView):
    """
    Video file list

    Query parameters
    ----------------

    HTTP parameters:
    `video_id` - The (parent) video by ID

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    filter_backends = (filters.OrderingFilter,)
    paginate_by = 50
    paginate_by_param = 'page_size'
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        queryset = self.queryset
        video_id = self.request.QUERY_PARAMS.get('video_id')
        if video_id is not None:
            queryset = queryset.filter(video_id=video_id)
        return queryset


class VideoFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


def wschange_redirect_view(request, path):
    if request.META['QUERY_STRING']:
        path += '?%s' % request.META['QUERY_STRING']
    return redirect('/api/' + path, permanent=True)
