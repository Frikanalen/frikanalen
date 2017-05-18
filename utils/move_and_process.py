#!/usr/bin/env python3
# encoding: utf-8
import json
import logging
import os
import shutil
import subprocess
import sys

from inotify import constants
from inotify.adapters import Inotify


DIR = '/tmp'
TO_DIR = '/tank/new_media/media/'
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

def get_metadata(filepath):
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-show_format',
        '-show_streams',
        '-of', 'json',
        filepath,
    ]
    output = subprocess.check_output(cmd)
    return json.loads(output.decode('utf-8'))

def direct_playable(metadata):
    def is_pal(s):
        return (
            s.get('codec_name') == 'dvvideo' and
            s.get('codec_time_base') == '1/25' and
            s.get('width') == 720)
    return any(is_pal(s) for s in metadata['streams'])

def run(watch_dir, move_to_dir):
    i = Inotify(block_duration_s=300)
    i.add_watch(bytes(watch_dir, 'utf-8'), constants.IN_MOVED_TO)
    for evt in i.event_gen():
        if evt is None:
            continue
        (_header, type_names, _path, fn) = evt
        fn = fn.decode('utf-8')
        if 'IN_ISDIR' not in type_names or not fn.isdigit():
            print('Skipped %s' % fn)
            continue
        print ('Found %s' % fn)
        handle_file(watch_dir, move_to_dir, fn)


def handle_file(watch_dir, move_to_dir, fn):
    from_dir = os.path.join(watch_dir, fn)
    video_fn = os.listdir(from_dir)[0]
    metadata = get_metadata(os.path.join(from_dir, video_fn))
    folder = 'original'
    if direct_playable(metadata):
        folder = 'broadcast'
    # move to real location
    new_path = os.path.join(move_to_dir, fn)
    os.makedirs(os.path.join(new_path, folder))
    new_file = os.path.join(new_path, folder, video_fn)
    shutil.move(
        os.path.join(from_dir, video_fn), new_file)
    print('Processing %s - %s - %s' % (fn, folder, video_fn))
    video_gen_script = os.path.join(SCRIPT_DIR, 'generate-video-files')
    subprocess.check_call([video_gen_script, fn])
    os.rmdir(from_dir)
    print ('Finished with %s' % fn)


if __name__ == '__main__':
    dir = sys.argv[1] if len(sys.argv) > 1 else DIR
    to_dir = sys.argv[2] if len(sys.argv) > 2 else TO_DIR

    try:
        if len(sys.argv) > 3:
            handle_file(dir, to_dir, sys.argv[3])
        else:
            run(dir, to_dir)
    except KeyboardInterrupt:
        pass
