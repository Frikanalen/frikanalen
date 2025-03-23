from django_filters import rest_framework as djfilters
from rest_framework import generics

from api.auth.permissions import IsInOrganizationOrReadOnly, IsInOrganizationOrDisallow
from api.search import search_videos
from api.video.serializers import VideoSerializer, VideoCreateSerializer, VideoUploadTokenSerializer
from api.views import Pagination
from fk.models import Video, Category


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


class VideoFilter(djfilters.FilterSet):
    categories__name__icontains = djfilters.ModelMultipleChoiceFilter(
        field_name="categories__name",
        to_field_name="name",
        lookup_expr="icontains",
        queryset=Category.objects.all(),
    )
    created_time = djfilters.DateTimeFromToRangeFilter()
    updated_time = djfilters.DateTimeFromToRangeFilter()
    uploaded_time = djfilters.DateTimeFromToRangeFilter()

    class Meta:
        model = Video
        fields = {
            "duration": ["exact", "gt", "gte", "lt", "lte"],
            "creator__email": ["exact"],
            "framerate": ["exact"],
            "has_tono_records": ["exact"],
            "is_filler": ["exact"],
            "name": ["exact", "icontains"],
            "organization": ["exact"],
            "played_count_web": ["exact", "gt", "gte", "lt", "lte"],
            "publish_on_web": ["exact"],
            "ref_url": ["exact", "startswith", "icontains"],
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
        f.column for f in Video._meta.fields if f.column in VideoSerializer.Meta().fields
    ]

    def get_serializer_class(self):
        if hasattr(self.request, "method") and self.request.method in ["POST", "PUT", "PATCH"]:
            return VideoCreateSerializer
        return VideoSerializer

    def get_queryset(self):
        # Can filtering on proper_import be done using a different
        # queryset and VideoFilter?
        proper_import = self.request.query_params.get("proper_import")
        if proper_import and "false" == proper_import:
            queryset = Video.objects.filter(proper_import=False)
        else:
            queryset = super(VideoList, self).get_queryset()

        search_query = self.request.query_params.get("q")
        if search_query:
            queryset = search_videos(queryset, query=search_query)
        return queryset
