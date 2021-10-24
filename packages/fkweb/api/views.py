# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

import csv
import datetime
import pytz

import logging
logger = logging.getLogger(__name__)

from django.contrib.auth import login, logout
from django.core.cache import caches
from django_filters import rest_framework as djfilters
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.cache import never_cache
from rest_framework.authentication import BasicAuthentication
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import response
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from fk.models import AsRun
from fk.models import Category
from fk.models import Scheduleitem
from fk.models import Video
from fk.models import VideoFile
from fk.models import Organization

from api.permissions import IsInOrganizationOrDisallow
from api.permissions import IsInOrganizationOrReadOnly
from api.permissions import IsOrganizationEditorOrReadOnly
from api.permissions import IsStaffOrReadOnly
from api.serializers import AsRunSerializer
from api.serializers import CategorySerializer
from api.serializers import ScheduleitemReadSerializer
from api.serializers import ScheduleitemModifySerializer
from api.serializers import TokenSerializer
from api.serializers import VideoFileSerializer
from api.serializers import VideoSerializer
from api.serializers import VideoCreateSerializer
from api.serializers import VideoUploadTokenSerializer
from api.serializers import UserSerializer
from api.serializers import OrganizationSerializer
from api.serializers import NewUserSerializer
from api.serializers import LoginSerializer


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
        'scheduleitems': reverse('api-scheduleitem-list', request=request),
        'videofiles': reverse('api-videofile-list', request=request),
        'videos': reverse('api-video-list', request=request),
        'organization': reverse('api-organization-list', request=request),
        'user': reverse('api-user-detail', request=request),
        'user/register': reverse('api-user-create', request=request),
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


# This class generates an invalid WWW-Authentication header, so that the 
# browser does not prompt the user in case of a 401 trying to log in on 
# the front-end.
class XBasicAuth(BasicAuthentication):
    def authenticate_header(self, request):
        return 'XXXBasic'

@method_decorator(never_cache, name='get')
class ObtainAuthToken(generics.RetrieveAPIView):
    """
    Get a token you can use as a header instead of basic auth.

    Use the header with HTTP like:
        Authorization: Token 000000000000...
    """
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    authentication_classes = [XBasicAuth]
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

@method_decorator(never_cache, name='get')
class ScheduleitemList(generics.ListCreateAPIView):
    """
    Video events schedule

    Query parameters
    ----------------

    `date` - Date expressed in the format YYYY-MM-DD (eg. 2020-12-31), or
             "today".  Default is today, Europe/Oslo time.

    `days` - Number of days schedule requested. Default is 7 days.

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `surrounding` - Fetch the first event before and after the given
                    period

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """
    queryset = Scheduleitem.objects.all()
    pagination_class = Pagination
    permission_classes = (IsInOrganizationOrReadOnly,)

    # Permit session-based login for backwards compat with old frontend
    # Remove when new planner works!
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_serializer_class(self):
        if hasattr(self.request, 'method') and self.request.method in ['POST', 'PUT']:
            return ScheduleitemModifySerializer
        return ScheduleitemReadSerializer

    @staticmethod
    def parse_yyyymmdd_or_today(inputDate):
        try:
            return datetime.datetime.strptime(inputDate, '%Y-%m-%d')\
                .astimezone(pytz.timezone('Europe/Oslo'))
        except (KeyError, ValueError, TypeError):
            return datetime.datetime.now(tz = pytz.timezone('Europe/Oslo'))

    @staticmethod
    def parse_int_or_7(inputDays):
        try:
            return int(inputDays)
        except (KeyError, ValueError, TypeError):
            return 7

    def get_queryset(self):
        params = self.request.query_params
        date = self.parse_yyyymmdd_or_today(params.get('date', None))
        days = self.parse_int_or_7(params.get('days', None))

        # FIXME by_day should be on queryset but need to upgrade
        # django first
        queryset = Scheduleitem.objects.by_day(
            date=date, days=days, surrounding=bool(params.get('surrounding')))

        return queryset.order_by('starttime')

    def get(self, request, *args, **kwargs):
        query_parameters = request.GET

        date = self.parse_yyyymmdd_or_today(query_parameters.get('date', None))
        days = self.parse_int_or_7(query_parameters.get('days', None))

        # The schedule cache is cleared on save() and delete() in fk/models.py:Scheduleitem
        cache = caches['schedule']
        cache_key = 'schedule-%s-%s' % (date.strftime('%Y%m%d'), days)

        # We only cache for the most common use case: Single day of schedule,
        # requested as JSON. If any other parameters are set, we simply disable
        # caching for the remainder of the request.
        cacheable = True
        if (type(request.accepted_renderer).__name__) != 'JSONRenderer': cacheable = False
        for disqualifying_parameter in ['surrounding', 'ordering', 'page_size']:
            if query_parameters.get(disqualifying_parameter, None) != None: cacheable = False

        if cacheable:
            cache_res = cache.get(cache_key)

            if cache_res:
                #logger.warning('[Scheduleitem] cache hit')
                return cache_res
            else:
                #logger.warning('[Scheduleitem] cache miss, cache_key=%s', cache_key)
                pass
        else:
            pass
            #logger.warning('[Scheduleitem] not caching')

        res = super().get(request, *args, **kwargs)
        res.accepted_renderer = request.accepted_renderer
        res.accepted_media_type = request.accepted_media_type
        res.renderer_context = self.get_renderer_context()
        res.render()

        if cacheable and res.status_code == 200:
            #logger.warning('[Scheduleitem] cache store, cache_key=%s', cache_key)
            cache.set(cache_key, res, None)

        return res

class ScheduleitemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Schedule item details
    """
    queryset = Scheduleitem.objects.all()

    def get_serializer_class(self):
        if hasattr(self.request, 'method') and self.request.method in ['POST', 'PUT']:
            return ScheduleitemModifySerializer
        return ScheduleitemReadSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)
    # Permit session-based login for backwards compat with old frontend
    # Remove when new planner works!
    authentication_classes = [SessionAuthentication, TokenAuthentication]


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
            'creator__email': ['exact'],
            'framerate': ['exact'],
            'has_tono_records': ['exact'],
            'is_filler': ['exact'],
            'name': ['exact', 'icontains'],
            'organization': ['exact'],
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

    `creator__email` - the email of the video's creator

    `framerate` - the framerate in hz * 1000

    `has_tono_records` - if the tono flag is set (true/false)

    `is_filler` - if this is a filler video (true/false)

    `name` - the exact name/title of the video

    `name__icontains` - substring is part of name/title of the video

    `organization` - Frikanalen ID of organization behind video

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
    pagination_class = Pagination
    filter_class = VideoFilter
    permission_classes = (IsInOrganizationOrReadOnly,)
    ordering_fields = [
        f.column for f in Video._meta.fields
        if f.column in VideoSerializer.Meta().fields
    ]

    def get_serializer_class(self):
        if hasattr(self.request, 'method') and self.request.method in ['POST', 'PUT', 'PATCH']:
            return VideoCreateSerializer
        return VideoSerializer

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


class VideoFileFilter(djfilters.FilterSet):
    created_time = djfilters.DateTimeFromToRangeFilter()

    class Meta:
        model = VideoFile
        fields = {
            'format__fsname': ['exact'],
            'integrated_lufs': ['exact', 'gt', 'gte', 'lt', 'lte', 'isnull'],
            'truepeak_lufs': ['exact', 'gt', 'gte', 'lt', 'lte', 'isnull'],
        }

class VideoFileList(generics.ListCreateAPIView):
    """
    Video file list

    Query parameters
    ----------------

    HTTP parameters:

    `video_id` - The (parent) video by ID

    `created_time` - when this file entry was created.

    `format__fsname` - the fileformat fsname for this file.

    `integrated_lufs` (includes __gt, __gte, __lt, __lte, __isnull) the overall loudness of the file.

    `truepeak_lufs` (includes __gt, __gte, __lt, __lte, __isnull) the overall loudness of the file.

    `page_size` - How many items per page. If set to 0 it will list
                  all items.  Default is 50 items.

    `ordering` - Order results by specified field.  Prepend a minus for
                 descending order.  I.e. `?ordering=-starttime`.
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    pagination_class = Pagination
    filter_class = VideoFileFilter
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


class OrganizationList(generics.ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = Pagination
    permission_classes = (IsOrganizationEditorOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(editor=self.request.user)


class OrganizationDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = (IsOrganizationEditorOrReadOnly,)


class VideoFileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Video file details
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    permission_classes = (IsInOrganizationOrReadOnly,)


class UserCreate(generics.CreateAPIView):
    throttle_classes = [AnonRateThrottle]
    permission_classes = [AllowAny]

    serializer_class = NewUserSerializer

    def perform_create(self, serializer):
        """Log user in on successful registration"""
        new_user = serializer.save()
        login(self.request, new_user)

@method_decorator(never_cache, name='dispatch')
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    User details - used to manage your own user
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

class UserLogin(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return response.Response(UserSerializer(user).data)

class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return response.Response()
