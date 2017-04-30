#!/usr/bin/env python3
# encoding: utf-8
import logging
import os
import subprocess
import sys

from inotify import constants
from inotify.adapters import Inotify


DIR = b'/tmp'
TO_DIR = b'/tank/new_media/media/'
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))


def run(watch_dir, move_to_dir):
    i = Inotify(block_duration_s=300)
    i.add_watch(bytes(watch_dir, 'utf-8'), constants.IN_MOVED_TO)
    for evt in i.event_gen():
        if evt is None:
            continue
        (header, type_names, path, fn) = evt
        if 'IN_ISDIR' not in type_names or not fn.isdigit():
            print('Skipped %s' % fn)
            continue
        print ('Found %s' % fn)
        from_dir = os.path.join(watch_dir, fn)
        video_fn = os.listdir(from_dir)[0]
        folder = 'original'
        if video_fn.endswith('.dv'):
            folder = 'broadcast'
        # move to real location
        new_path = os.path.join(move_to_dir, fn, folder)
        os.makedirs(new_path)
        os.rename(
            os.path.join(from_dir, video_fn),
            os.path.join(new_path, video_fn))
        print('Processing %s - %s' % (new_path, video_fn))
        video_gen_script = os.path.join(SCRIPT_DIR, 'generate-video-files')
        subprocess.check_call([video_gen_script, fn])
        os.rmdir(from_dir)
        print ('Finished with %s' % fn)


if __name__ == '__main__':
    dir = sys.argv[1] if len(sys.argv) > 1 else DIR
    to_dir = sys.argv[2] if len(sys.argv) > 2 else TO_DIR

    try:
        run(dir, to_dir)
    except KeyboardInterrupt:
        pass
