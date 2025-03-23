# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.

import csv
import logging
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.reverse import reverse

from fk.models import AsRun
from fk.models import Category
from fk.models import Video
from fk.models import VideoFile

from api.auth.permissions import IsStaffOrReadOnly
from api.schedule.serializers import AsRunSerializer
from api.serializers import CategorySerializer

logger = logging.getLogger(__name__)


@api_view(["GET"])
def api_root(request):
    """
    The root of the FK API / web services
    """
    return Response(
        {
            "asrun": reverse("asrun-list", request=request),
            "category": reverse("category-list", request=request),
            "jukebox-csv": reverse("jukebox-csv", request=request),
            "obtain-token": reverse("api-token-auth", request=request),
            "scheduleitems": reverse("api-scheduleitem-list", request=request),
            "videofiles": reverse("api-videofile-list", request=request),
            "videos": reverse("api-video-list", request=request),
            "organization": reverse("api-organization-list", request=request),
            "user": reverse("api-user-detail", request=request),
            "user/register": reverse("api-user-create", request=request),
        }
    )


@api_view(["GET"])
def jukebox_csv(request):
    response = HttpResponse(content_type="text/csv; charset=utf-8")
    response["Content-Disposition"] = "filename=jukebox.csv"
    fields = (
        "id|name|has_tono_records|video_id|type_id|version|"
        "creation_began|creation_finished|offset|duration|location".split("|")
    )
    writer = csv.DictWriter(response, fields, delimiter="|")
    writer.writeheader()
    for video in Video.objects.filter(
        is_filler=True, has_tono_records=False, organization__fkmember=True
    ):
        try:
            videofile = video.videofile_set.get(format__fsname="broadcast")
        except VideoFile.DoesNotExist:
            continue
        writer.writerow(
            dict(
                id=video.id,
                name=video.name.encode("utf-8"),
                has_tono_records={False: "f", True: "t"}[video.has_tono_records],
                video_id=video.id,
                type_id=videofile.format.id,
                version=1,  # What is this for?
                creation_began=video.created_time,  # ??
                creation_finished=None,  # ??
                offset=0,
                duration=video.duration.total_seconds(),
                location="http://frontend.frikanalen.tv/media/%s"
                % (videofile.filename.encode("utf-8")),
            )
        )
    return response


# This class generates an invalid WWW-Authentication header, so that the
# browser does not prompt the user in case of a 401 trying to log in on
# the front-end.


class Pagination(LimitOffsetPagination):
    default_limit = 50
    max_limit = 1000


class AsRunViewSet(ModelViewSet):
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


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (IsStaffOrReadOnly,)
    pagination_class = Pagination
