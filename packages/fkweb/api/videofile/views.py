from django.utils import timezone
from django_filters import rest_framework as djfilters
from rest_framework import generics

from api.auth.permissions import IsInOrganizationOrReadOnly
from api.videofile.serializers import VideoFileSerializer
from api.views import Pagination
from fk.models import VideoFile


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

    `video_id`

        The (parent) video by ID

    `created_time`

        when this file entry was created.

    `format__fsname`

        the fileformat fsname for this file.

    `integrated_lufs` (includes __gt, __gte, __lt, __lte, __isnull)

        the overall loudness of the file.

    `truepeak_lufs` (includes __gt, __gte, __lt, __lte, __isnull)

        the overall loudness of the file.

    `page_size`

        How many items per page. If set to 0 it will list all items.
        Default is 50 items.

    `ordering`

        Order results by specified field.
        Prepend a minus for descending order, eg. `?ordering=-starttime`.
    """
    queryset = VideoFile.objects.all()
    serializer_class = VideoFileSerializer
    pagination_class = Pagination
    filter_class = VideoFileFilter
    permission_classes = (IsInOrganizationOrReadOnly, )

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
    permission_classes = (IsInOrganizationOrReadOnly, )