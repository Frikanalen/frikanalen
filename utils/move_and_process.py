#!/usr/bin/env python3
# encoding: utf-8
import json
import logging
import os
import re
import shutil
import subprocess
import sys

import requests
from inotify import constants
from inotify.adapters import Inotify


FK_API = os.environ.get('FK_API', 'http://beta.frikanalen.no/api')
FK_TOKEN = os.environ.get('FK_TOKEN')
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

def get_mlt_duration(filepath):
    cmd = ['melt', '-consumer', 'xml', filepath]
    output = subprocess.check_output(cmd, stderr=subprocess.DEVNULL)
    output = output.decode('utf-8')
    m = re.search(r' name="length">(\d+)</', output)
    if not m:
        return
    frames = int(m.group(1))
    m = re.search(r'\.frame_rate">([\d.]+)</', output)
    if not m:
        return
    fps = float(m.group(1))
    return frames/fps

def get_duration(new_file, metadata):
    mlt_duration = get_mlt_duration(new_file)
    duration = mlt_duration or metadata['format']['duration']
    min, sec = divmod(duration, 60)
    hours, _ = divmod(min, 60)
    return '{:d}:{:02d}:{:02f}'.format(int(hours), int(min), sec)

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
    _update_video(int(fn), {'duration': get_duration(new_file, metadata)})
    print('Processing %s - %s - %s' % (fn, folder, video_fn))
    video_gen_script = os.path.join(SCRIPT_DIR, 'generate-video-files')
    subprocess.check_call([video_gen_script, fn])
    os.rmdir(from_dir)
    print ('Finished with %s' % fn)

def _update_video(video_id, data):
    response = requests.patch(
        '%s/videos/%d' % (FK_API, video_id),
        headers={'Authorization': 'Token %s' % FK_TOKEN},
        data=data,
    )

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
