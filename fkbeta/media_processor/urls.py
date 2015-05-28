# Copyright (c) 2012-2013 Benjamin Bruheim <grolgh@gmail.com>
# This file is covered by the LGPLv3 or later, read COPYING for details.
from django.conf.urls import patterns, url

from media_processor import views

urlpatterns = patterns('',
    url(r'^members/uploads/',
        views.MediaUploadsView.as_view(), name='manage-media-uploads'),
    )
