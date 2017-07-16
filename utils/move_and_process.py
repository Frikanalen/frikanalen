#!/usr/bin/env python3
# encoding: utf-8
import json
import logging
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime

import requests
from inotify import constants
from inotify.adapters import Inotify


FK_API = os.environ.get('FK_API', 'http://beta.frikanalen.no/api')
FK_TOKEN = os.environ.get('FK_TOKEN')
DIR = '/tmp'
TO_DIR = '/tank/new_media/media/'
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

# XXX very hacky
VF_FORMATS = {
    'large_thumb': 1,
    'broadcast': 2,
    'vc1': 3,
    'med_thumb': 4,
    'small_thumb': 5,
    'original': 6,
    'theora': 7,
    'srt': 8,
}
for k, v in list(VF_FORMATS.items()):
    VF_FORMATS[v] = k

logging.basicConfig(level=logging.DEBUG)


class Converter(object):
    CONVERT = {
        'theora': {
            'ffmpeg': (
                '-vcodec libtheora -acodec libvorbis '
                '-qscale:v 7 -qscale:a 2 -vf scale=720:-1'),
            'ext': 'ogv',
        },
        'broadcast': {
            'ffmpeg': '-target pal-dv',
            'ext': 'dv',
        },
        'large_thumb': {
            'ffmpeg': '-vframes 1 -ss {thumb_sec} -vf scale=720:-1 -aspect 16:9',
            'ext': 'jpg',
        },
    }

    @classmethod
    def new_filepath(cls, path, format):
        c = cls.CONVERT[format]
        fn = os.path.splitext(os.path.basename(path))[0]
        return os.path.join(
            os.path.dirname(os.path.dirname(path)),
            format,
            "%s.%s" % (fn, c['ext']))

    @classmethod
    def convert_cmds(cls, filepath, format, metadata=None):
        c = cls.CONVERT[format]
        to_fn = cls.new_filepath(filepath, format)
        cmd = ['ffmpeg', '-nostats', '-i', filepath, '-y',
               '-threads', '8']
        dur = int(metadata and metadata['duration'] * 0.25 or 30)
        cmd.extend(c['ffmpeg'].format(thumb_sec=dur).split())
        cmd.append(to_fn)
        return cmd, to_fn

    @classmethod
    def get_formats(cls, filepath):
        formats = ['large_thumb']
        path = os.path.dirname(filepath)
        if 'original' in path:
            formats.append('broadcast')
        else:
            assert 'broadcast' in path
        formats.append('theora')
        return formats


class Runner(object):
    @classmethod
    def run(cls, cmd, filepath=None):
        logging.info('Running: %s', ' '.join(cmd))
        if filepath:
            os.makedirs(os.path.dirname(filepath))
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        logging.debug(output.decode('utf-8'))


def get_metadata(filepath):
    md = get_metadata_(filepath)
    md['mlt_duration'] = get_mlt_duration(filepath)
    md['duration'] = md['mlt_duration'] or md['format']['duration']
    md['pretty_duration'] = pretty_duration(md['duration'])
    return md

def get_metadata_(filepath):
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

def pretty_duration(duration):
    min, sec = divmod(duration, 60)
    hours, _ = divmod(min, 60)
    return '{:d}:{:02d}:{:02f}'.format(int(hours), int(min), sec)

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

def direct_playable(metadata):
    def is_pal(s):
        return (
            s.get('codec_name') == 'dvvideo' and
            s.get('codec_time_base') == '1/25' and
            s.get('width') == 720)
    return any(is_pal(s) for s in metadata['streams'])

def move_original(from_dir, to_dir, metadata, fn):
    folder = 'broadcast' if direct_playable(metadata) else 'original'
    os.makedirs(os.path.join(to_dir, folder))
    new_filepath = os.path.join(to_dir, folder, fn)
    shutil.move(os.path.join(from_dir, fn), new_filepath)
    return new_filepath

def register_videofiles(id, folder):
    files = get_videofiles(id)
    has_formats = {VF_FORMATS[f['format']] for f in files}
    for file_folder in os.listdir(folder):
        if file_folder in has_formats:
            logging.debug('format %s already exists', file_folder)
            continue
        for fn in os.listdir(os.path.join(folder, file_folder)):
            create_videofile(id, {
                'filename': os.path.join(str(id), file_folder, fn),
                'format': VF_FORMATS[file_folder],
            })

def generate_videos(
        id, filepath, metadata=None, runner_run=Runner.run,
        converter=Converter, register=register_videofiles):
    logging.info('Processing: %s', filepath)
    base_path = os.path.dirname(os.path.dirname(filepath))
    formats = converter.get_formats(filepath)
    for t in formats:
        cmds, new_fn = converter.convert_cmds(filepath, t, metadata)
        runner_run(cmds, new_fn)
        register(id, base_path)


def _update_video(video_id, data):
    response = requests.patch(
        '%s/videos/%d' % (FK_API, video_id),
        headers={'Authorization': 'Token %s' % FK_TOKEN},
        data=data,
    )
    response.raise_for_status()

def get_videofiles(video_id):
    response = requests.get(
        '%s/videofiles/' % FK_API,
        params={'video_id': video_id},
        headers={'Authorization': 'Token %s' % FK_TOKEN},
    )
    response.raise_for_status()
    return response.json()['results']

def create_videofile(video_id, data):
    data.update({'video': video_id})
    response = requests.post(
        '%s/videofiles/' % FK_API,
        headers={'Authorization': 'Token %s' % FK_TOKEN},
        data=data,
    )
    response.raise_for_status()

def run(watch_dir, move_to_dir):
    logging.info('Starting move_and_process, watch: %s, move_to: %s',
                 watch_dir, move_to_dir)
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

def handle_file(watch_dir, move_to_dir, str_id):
    id = int(str_id)
    from_dir = os.path.join(watch_dir, str_id)
    fn = os.listdir(from_dir)[0]
    metadata = get_metadata(os.path.join(from_dir, fn))
    to_dir = os.path.join(move_to_dir, str_id)

    new_filepath = move_original(from_dir, to_dir, metadata, fn)
    _update_video(id, {
        'duration': metadata['pretty_duration'],
        'uploaded_time': datetime.utcnow().isoformat(),
    })
    generate_videos(id, new_filepath or str_id, metadata)
    _update_video(id, { 'proper_import': True })
    os.rmdir(from_dir)

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
