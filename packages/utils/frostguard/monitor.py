#!/usr/bin/env python3

from prometheus_client import Gauge
from prometheus_client import start_http_server
import subprocess
import shlex
import sys

start_http_server(9001)

video_frozen = Gauge('pgm_motion_state', 'Description')

URL = 'http://192.168.3.1:9094/frikanalen.ts'
#ff_cmd = """curl --output - -q """ + URL + """ | ffprobe -f lavfi -i "movie=/dev/stdin,freezedetect=n=0:d=0.001[out0]" -show_entries tags=lavfi.freezedetect.freeze_start,lavfi.freezedetect.freeze_duration,lavfi.freezedetect.freeze_end -of default=nw=1"""
ff_cmd = """curl --output - -q """ + URL + """ | ffprobe -f lavfi -i "movie=/dev/stdin,freezedetect=n=0.003[out0]" -show_entries tags=lavfi.freezedetect.freeze_start,lavfi.freezedetect.freeze_duration,lavfi.freezedetect.freeze_end -of default=nw=1"""
#ff_cmd = "xxd /dev/urandom"

video_frozen.set(1)
print("starting", shlex.split(ff_cmd), flush=True)
with subprocess.Popen(shlex.split(shlex.quote(ff_cmd)), bufsize=0, universal_newlines=True, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as proc:
    while True:
        output = proc.stdout.readline().strip()
        try:
            tag, keyvalue = output.split(':')
            if tag == 'TAG':
                key, value = keyvalue.split('=')
                if key == 'lavfi.freezedetect.freeze_end':
                    print("Freeze end", flush=True)
                    video_frozen.set(1)
                elif key == 'lavfi.freezedetect.freeze_start':
                    print("Freeze begin", flush=True)
                    video_frozen.set(0)
        except ValueError:
            pass
        if proc.poll() != None:
            sys.exit(1)
#
#TAG:lavfi.freezedetect.freeze_end=2678.16
#TAG:lavfi.freezedetect.freeze_duration=2.82
#TAG:lavfi.freezedetect.freeze_end=2678.16
