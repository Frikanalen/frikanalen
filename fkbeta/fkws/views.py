# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

import csv
import datetime

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters import rest_framework as djfilters
from rest_framework import filters
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse

import fkvod.search
from fk.models import AsRun
from fk.models import Category
from fk.models import Organization
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import VideoFile
from fkws.permissions import IsInOrganizationOrDisallow
from fkws.permissions import IsInOrganizationOrReadOnly
from fkws.permissions import IsStaffOrReadOnly
from fkws.serializers import AsRunSerializer
from fkws.serializers import CategorySerializer
from fkws.serializers import OrganizationSerializer
from fkws.serializers import ScheduleitemSerializer
from fkws.serializers import TokenSerializer
from fkws.serializers import VideoFileSerializer
from fkws.serializers import VideoSerializer
from fkws.serializers import VideoUploadTokenSerializer


@api_view(['GET'])
def api_root(request, format=None):
    """
    The root of the FK API / web services
    """
    return Response({
        'asrun': reverse('asrun-list', request=request),
        'category': reverse('category-list', request=request),
        'jukebox-csv': reverse('jukebox-csv', request=request),
        'obtain-token': reverse('api-token-auth', request=request),
        'organizations': reverse('api-organization-list', request=request),
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videofiles': reverse('api-videofile-list', request=request),
        'videos': reverse('api-video-list', request=request),
    })


@api_view(['GET'])
def jukebox_csv(request, format=None):
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'filename=jukebox.csv'
    fields = ('id|name|has_tono_records|video_id|type_id|version|'
              'creation_began|creation_finished|offset|duration|location'
              .split('|'))
    writer = csv.DictWriter(response, fields, delimiter='|')
    writer.writeheader()
    for video in Video.objects.filter(is_filler=True, has_tono_records=False,
            organization__fkmember=True):
        try:
            videofile = video.videofile_set.get(format__fsname='broadcast')
        except VideoFile.DoesNotExist:
            continue
        writer.writerow(dict(
            id=video.id,
            name=video.name.encode('utf-8'),
            has_tono_records={False: 'f', True: 't'}[video.has_tono_records],
            video_id=video.id,
            type_id=videofile.format.id,
            version=1,                          # What is this for?
            creation_began=video.created_time,  # ??
            creation_finished=None,             # ??
            offset=0,
            duration=video.duration.total_seconds(),
            location='http://frontend.frikanalen.tv/media/%s' % (
                videofile.filename.encode('utf-8')),
            ))
    return response


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


class Pagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000


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
    permission_classes = (IsStaffOrReadOnly,)
    pagination_class = Pagination

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsStaffOrReadOnly,)
    pagination_class = Pagination

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
    pagination_class = Pagination
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        params = self.request.query_params
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


class VideoFilter(djfilters.FilterSet):
    categories__name__icontains = djfilters.ModelMultipleChoiceFilter(
        field_name='categories__name',
        to_field_name='name',
        lookup_expr='icontains',
        queryset=Category.objects.all(),
    )
    created_time = djfilters.DateTimeFromToRangeFilter()
    updated_time = djfilters.DateTimeFromToRangeFilter()
    uploaded_time = djfilters.DateTimeFromToRangeFilter()

    class Meta:
        model = Video
        fields = {
            'duration': ['exact', 'gt', 'gte', 'lt', 'lte'],
            'editor__username': ['exact'],
            'framerate': ['exact'],
            'has_tono_records': ['exact'],
            'is_filler': ['exact'],
            'name': ['exact', 'icontains'],
            'organization__name': ['exact'],
            'played_count_web': ['exact', 'gt', 'gte', 'lt', 'lte'],
            'publish_on_web': ['exact'],
            'ref_url': ['exact', 'startswith', 'icontains'],
        }

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

    `editor__username` - the username of the editor

    `framerate` - the framerate in hz * 1000

    `has_tono_records` - if the tono flag is set (true/false)

    `is_filler` - if this is a filler video (true/false)

    `name` - the exact name/title of the video

    `name__icontains` - substring is part of name/title of the video

    `organization__name` - the name of the organization this video is associated with

    `played_count_web` - the number of times this video was played on the web

    `played_count_web__gt` - greater than

    `played_count_web__gte` - greater than or equal

    `played_count_web__lt`  - less than

    `played_count_web__lte` - less than or equal

    `publish_on_web` - if this video is published ont the web (true/false)

    `proper_import` - if the uploaded video was properly imported (true/false)

    `ref_url` - the exact reference url

    `ref_url__startswith` - the reference url start with this string

    `ref_url__icontains` - the reference url contain this string

    """
    queryset = Video.objects.filter(proper_import=True)
    serializer_class = VideoSerializer
    pagination_class = Pagination
    filter_class = VideoFilter
    permission_classes = (IsInOrganizationOrReadOnly,)
    ordering_fields = [
        f.column for f in Video._meta.fields
        if f.column in VideoSerializer.Meta().fields
    ]

    def get_queryset(self):
        # Can filtering on proper_import be done using a different
        # queryset and VideoFilter?
        proper_import = self.request.query_params.get('proper_import')
        if proper_import and 'false' == proper_import:
            queryset = Video.objects.filter(proper_import=False)
        else:
            queryset = super(VideoList, self).get_queryset()

        search_query = self.request.query_params.get('q')
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

class VideoUploadTokenDetail(generics.RetrieveAPIView):
    """
    Video details
    """
    queryset = Video.objects.all()
    serializer_class = VideoUploadTokenSerializer
    permission_classes = (IsInOrganizationOrDisallow,)


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
    pagination_class = Pagination
    permission_classes = (IsInOrganizationOrReadOnly,)

    def get_queryset(self):
        queryset = super(VideoFileList, self).get_queryset()
        video_id = self.request.query_params.get('video_id')
        if video_id and video_id.isdigit():
            queryset = queryset.filter(video_id=int(video_id))
        return queryset

    def perform_create(self, serializer):
        video = serializer.validated_data['video']
        # If we don't have a uploaded time, creating a file should set one.
        if not video.uploaded_time:
            video.uploaded_time = timezone.now()
            video.save()
        super(VideoFileList, self).perform_create(serializer)


class VideoFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)

class OrganizationList(generics.ListAPIView):
    """
    List of organizations

    Query parameters
    ----------------

    HTTP parameters:

    `fkmember`  - Boolean (true/false) to filter on Frikanalen membership status

    `orgnr`     - The organization number

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    filter_backends = (filters.OrderingFilter,)
    pagination_class = Pagination

    def get_queryset(self):
        queryset = super(OrganizationList, self).get_queryset()
        fkmember = self.request.query_params.get('fkmember')
        if fkmember:
            if 'true' == fkmember:
                queryset = queryset.filter(fkmember=True)
            else:
                queryset = queryset.filter(fkmember=False)
        orgnr = self.request.query_params.get('orgnr')
        if orgnr and orgnr.isdigit():
            queryset = queryset.filter(orgnr=int(orgnr))
        return queryset
