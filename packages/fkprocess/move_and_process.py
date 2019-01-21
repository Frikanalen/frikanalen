#!/usr/bin/env python3
# encoding: utf-8
import argparse
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime

import requests
from inotify import constants
from inotify.adapters import Inotify


FK_API = os.environ.get('FK_API', 'https://frikanalen.no/api')
FK_TOKEN = os.environ.get('FK_TOKEN')
DIR = '/tmp'
TO_DIR = '/tank/media/'
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

# Global argument object
args = None

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


class AppError(Exception):
    pass

class SkippableError(Exception):
    pass


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
    def run(cls, cmd, filepath=None, reprocess=False):
        logging.info('Running: %s', ' '.join(cmd))
        if filepath:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            if os.path.exists(filepath):
                if reprocess:
                    logging.info("Deleting file for reprocessing: %s", filepath)
                    os.remove(filepath)
                else:
                    logging.info("SKIP already existing file: %s", filepath)
                    return
        output = ""
        try:
            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as e:
            output = e.output
            raise e
        finally:
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

def can_get_loudness():
    return shutil.which('bs1770gain')

def get_loudness(filepath):
    try:
        cmd = ['bs1770gain', '--xml', '--truepeak', filepath]
        output = subprocess.check_output(cmd, stderr=subprocess.DEVNULL)
        output = output.decode('utf-8')
        integrated_lufs = re.findall(r'<integrated lufs="([\d.-]+)"', output)[-1]
        truepeak_lufs = re.findall(r'<true-peak tpfs="([\d.-]+|-inf)"', output)[-1]
        data = {
            'integrated_lufs': float(integrated_lufs),
        }
        if '-inf' != truepeak_lufs:
           data['truepeak_lufs'] = float(truepeak_lufs)
        return data
    except (IndexError, ValueError, FileNotFoundError) as e:
        return None

def rq(method, path, **kwargs):
    if args.no_api:
        raise Exception("Should not call request in no-api. Fix code.")
    s = requests.Session()
    adapter = requests.adapters.HTTPAdapter(max_retries=3)
    s.mount('http://', adapter)
    s.mount('https://', adapter)
    response = s.request(method,
        args.api + path,
        headers={'Authorization': 'Token %s' % args.token},
        **kwargs)
    response.raise_for_status()
    return response

def direct_playable(metadata):
    def is_pal(s):
        return (
            s.get('codec_name') == 'dvvideo' and
            s.get('codec_time_base') == '1/25' and
            s.get('width') == 720)
    return any(is_pal(s) for s in metadata['streams'])

def copy_original(from_dir, to_dir, metadata, fn):
    folder = 'broadcast' if direct_playable(metadata) else 'original'
    os.makedirs(os.path.join(to_dir, folder), exist_ok=True)
    new_filepath = os.path.join(to_dir, folder, fn)
    shutil.copy2(os.path.join(from_dir, fn), new_filepath)
    return new_filepath

def register_videofiles(id, folder, videofiles=None):
    files = get_videofiles({'video_id': id})
    videofiles = (videofiles or set()).union({f['filename'].strip() for f in files})
    for file_folder in os.listdir(folder):
        for fn in os.listdir(os.path.join(folder, file_folder)):
            filepath = os.path.join(str(id), file_folder, fn)
            if filepath in videofiles:
                continue
            data = {
                'filename': filepath,
                'format': VF_FORMATS[file_folder],
            }
            loudness = get_loudness(os.path.join(folder, "..", filepath))
            # Handle images, which do not have loudness
            if loudness:
                data.update(loudness)
            create_videofile(id, data)
            videofiles.add(filepath)
    return videofiles

def generate_videos(
        id, filepath, metadata=None, runner_run=Runner.run,
        converter=Converter, register=register_videofiles,
        reprocess=False):
    logging.info("Processing: %s", filepath)
    base_path = os.path.dirname(os.path.dirname(filepath))
    formats = converter.get_formats(filepath)
    videofiles = set()
    for t in formats:
        cmds, new_fn = converter.convert_cmds(filepath, t, metadata)
        runner_run(cmds, filepath=new_fn, reprocess=reprocess)
        videofiles = register(
            id, base_path, videofiles=videofiles)


def _update_video(video_id, data):
    if args.no_api:
        logging.debug("NO API - updating video %s -> %r" % (video_id, data))
        return
    response = rq('PATCH', '/videos/%s' % video_id, data=data)

def get_videofiles(params):
    if args.no_api:
        logging.debug("NO API - get videofiles %s -> []" % params)
        return []
    response = rq('GET', '/videofiles/', params=params)
    return response.json()['results']

def create_videofile(video_id, data):
    if args.no_api:
        logging.debug("NO API - creating videofile %s -> %r" % (video_id, data))
        return
    data.update({'video': video_id})
    rq('POST', '/videofiles/', data=data)

def update_videofile(data):
    videofile_id = data['id']
    if args.no_api:
        logging.debug("NO API - updating videofile %s -> %r" % (videofile_id, data))
        return
    rq('PATCH', '/videofiles/%s' % videofile_id, data=data)

def measure_loudness(watch_dir, move_to_dir):
    """Measure loudness for all video files missing it, a few at the time.

    Process latest videos first.
    """

    maxtime = 60 # stop processing after this amount of seconds
    pagesize = 2 # Process this amount of video file per format at the time
    start = time.time()
    for fsname in ('original', 'broadcast', 'theora'):
        params = {
            'format__fsname': fsname,
            'integrated_lufs__isnull': True,
            'page_size': pagesize,
            'order': '-video'
        }

        for data in get_videofiles(params):
            newdata = data.copy()
            filepath = data['filename']
            loudness = get_loudness(os.path.join(move_to_dir, filepath))
            if loudness:
                newdata.update(loudness)
            if data != newdata:
                update_videofile(newdata)
        if time.time() - start > maxtime: # Time to stop?
            break
    return

def run_periodic(watch_dir, move_to_dir):
    """Called periodially when there is nothing else to do for this process."""

    logging.debug("processing backlog")
    measure_loudness(watch_dir, move_to_dir)
    return

def run_inotify(watch_dir, move_to_dir):
    logging.info("Starting move_and_process, watch: %s, move_to: %s",
                 watch_dir, move_to_dir)
    i = Inotify(block_duration_s=300)
    i.add_watch(watch_dir, constants.IN_MOVED_TO)
    for evt in i.event_gen():
        if evt is None:
            # Call every block_duration_s seconds when there is nothing else to do
            run_periodic(watch_dir, move_to_dir)
            continue
        (_header, type_names, _path, fn) = evt
        if 'IN_ISDIR' not in type_names or not fn.isdigit():
            logging.info('Skipped %s' % fn)
            continue
        logging.info('Found %s' % fn)
        handle_file(watch_dir, move_to_dir, int(fn))

def run(watch_dir, move_to_dir):
    for folder in os.listdir(watch_dir):
        if (folder.startswith('.')
                or not folder.isdigit()
                or not os.path.isdir(os.path.join(watch_dir, folder))):
            continue
        try:
            handle_file(watch_dir, move_to_dir, int(folder))
        except SkippableError as e:
            logging.debug(e)
            logging.debug("Skipping %s" % folder)

def handle_file(watch_dir, move_to_dir, id):
    logging.info("Handling file id: %d - moving from %s to %s",
                 id, watch_dir, move_to_dir)
    str_id = str(id)
    from_dir = os.path.join(watch_dir, str_id)
    try:
        fn = os.listdir(from_dir)[0]
    except IndexError:
        raise SkippableError("Found no file in %s" % from_dir)
    metadata = get_metadata(os.path.join(from_dir, fn))
    to_dir = os.path.join(move_to_dir, str_id)

    new_filepath = copy_original(from_dir, to_dir, metadata, fn)
    _handle_file(id, new_filepath or str_id, metadata)
    shutil.rmtree(from_dir)

def _handle_file(id, filepath, metadata, reprocess=False):
    _update_video(id, {
        'duration': metadata['pretty_duration'],
        'uploaded_time': datetime.utcnow().isoformat(),
    })
    generate_videos(id, filepath, metadata, reprocess=reprocess)
    _update_video(id, { 'proper_import': True })

def update_existing_file(id, to_dir, force):
    logging.info("Trying to update existing file id: %d in folder %s",
                 id, to_dir)
    str_id = str(id)
    if not os.path.isdir(os.path.join(to_dir, str_id)):
        raise AppError("No folder %d/ in %s" % (id, to_dir))
    fn = None
    path = None
    for folder in ['original', 'broadcast']:
        path = os.path.join(to_dir, str_id, folder)
        if os.path.isdir(path):
            fn = os.listdir(path)[0]
            break
    else:
        raise AppError("Found no file for %d, last checked in %s" % (id, path))
    filepath = os.path.join(path, fn)
    metadata = get_metadata(filepath)
    _handle_file(id, filepath, metadata, reprocess=True)

def main():
    global args
    top_parser = argparse.ArgumentParser(
            description="Moving frikanalen videos and processing media files")
    subparsers = top_parser.add_subparsers()

    common_args = argparse.ArgumentParser(add_help=False)
    common_args.add_argument('--indir',
            help="""Folder where new `<id>/mediafile.mp4` are found
            (default: %(default)s)""", default=DIR)
    common_args.add_argument('--outdir',
            help="""Folder where `<id>/<media_folders>/<file>` are processed
            (default: %(default)s)""", default=TO_DIR)
    common_args.add_argument('--no-api', action='store_true',
            help="Do not call the API")
    common_args.add_argument('--api',
            help="Frikanalen API url (default: %(default)s, env: FK_API)", default=FK_API)
    common_args.add_argument('--token',
            help="Frikanalen API token to update database (env: FK_TOKEN)", default=FK_TOKEN)

    process_p = subparsers.add_parser('process', parents=[common_args],
            help="Reprocess media files (manual try-again mode)")
    process_p.add_argument('video_id', type=int,
            help="The ID of the video you want to update (ie. 626060)")
    process_p.add_argument('-f', '--force', action='store_true',
            help="Overwrite (rm) existing media files instead of skipping")
    process_p.set_defaults(cmd=process_cmd)

    run_p = subparsers.add_parser('run', parents=[common_args],
            help="Check files in in-folder and process files to out-folder")
    run_p.set_defaults(cmd=run_cmd)

    daemon_p = subparsers.add_parser('daemon', parents=[common_args],
            help="Listen for new folders in in-folder and process files to out-folder")
    daemon_p.set_defaults(cmd=daemon_cmd)

    args = top_parser.parse_args()
    if 'cmd' not in args:
        top_parser.print_help()
        sys.exit(1)
    try:
        args.cmd(args)
    except KeyboardInterrupt:
        pass
    except AppError as e:
        print()
        print(e)
        sys.exit(1)

def process_cmd(args):
    update_existing_file(args.video_id, args.outdir, force=args.force)

def daemon_cmd(args):
    run_inotify(args.indir, args.outdir)

def run_cmd(args):
    run(args.indir, args.outdir)

if __name__ == '__main__':
    main()
