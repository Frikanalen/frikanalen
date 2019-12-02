import asyncio

from aiohttp import web
from prometheus_client import Histogram, Gauge
from prometheus_async.aio import time, web

from snapshot import Snapshot
from audio_analysis import scan

L_VU_METER = Gauge('audio_vu', 'VU average over sample size in dBFS')

async def main():
    snapshot = Snapshot()

    web.start_http_server_in_thread(port=8000)
    while True:
        await asyncio.sleep(5)
        print('Getting snapshot...')
        await snapshot.update()
        dBFS = scan()
        L_VU_METER.set(dBFS)

if __name__ == '__main__':
    asyncio.run(main())
