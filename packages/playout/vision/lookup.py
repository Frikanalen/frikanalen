#!/usr/bin/python
# -*- coding: utf-8 -*-
import glob
import logging
import os.path

from .configuration import configuration


VIDEO_FILENAME_GLOBS = ['*.avi', '*.mpg', '*.mov', '*.dv', '*.mp4']


def cache_path(name):
    root = './'
    return os.path.join(root, 'cache', name)


def _glob_path(media_root, video_id, render_type, video_filename_globs):
    for video_filename_glob in video_filename_globs:
        paths = os.path.join(str(video_id), render_type, video_filename_glob)
        filename_glob = os.path.join(media_root, paths)
        filename = glob.glob(filename_glob)
        if filename:
            break
    return filename


def locate_media_by_id(video_id, video_filename_globs=VIDEO_FILENAME_GLOBS):
    # example path: 'videos/1302/broadcast/'
    # First look at ./cache/video/1302/broadcast
    filename = _glob_path(configuration.video_cache_root, video_id, configuration.render_type, video_filename_globs)
    if not filename:
        # Then ./cache/video/1302/
        filename = _glob_path(configuration.video_cache_root, video_id, '', video_filename_globs)
    if not filename:
        # Then (media_root)/1302/broadcast
        filename = _glob_path(configuration.media_root, video_id, configuration.render_type, video_filename_globs)
    if not filename:
        # Give up
        logging.debug('Could not find video_id %d' % video_id)
        paths = [configuration.media_root, str(video_id), configuration.render_type]
        return os.path.join(*paths)
    return filename[0]
