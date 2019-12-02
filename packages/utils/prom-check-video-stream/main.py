#!/usr/bin/env python3
import asyncio

from aiohttp import web
from prometheus_client import Histogram, Gauge
from prometheus_async.aio import time, web

from snapshot import Snapshot
from audio_analysis import scan
from ts_analysis import analysis

VU_METER = Gauge('audio_vu', 'VU average over sample size in dBFS')
VIDEO_BITRATE = Gauge('video_bitrate', 'bits per second in sample')
AUDIO_BITRATE = Gauge('audio_bitrate', 'bits per second in sample')
MISC_BITRATE = Gauge('misc_bitrate', 'bits per second in sample')

async def main():
    snapshot = Snapshot()

    web.start_http_server_in_thread(port=8000)
    while True:
        print('Getting snapshot...')
        await snapshot.update()
        dBFS = scan()
        VU_METER.set(dBFS)
        an = analysis()
        misc_bitrate = 0
        for pid, data in an['pids'].items():
            if pid in [564, 768]:
                continue
            misc_bitrate += data['bitrate']
        MISC_BITRATE.set(misc_bitrate)
        VIDEO_BITRATE.set(an['pids'][564]['bitrate'])
        AUDIO_BITRATE.set(an['pids'][768]['bitrate'])
        await asyncio.sleep(5)

if __name__ == '__main__':
    asyncio.run(main())
