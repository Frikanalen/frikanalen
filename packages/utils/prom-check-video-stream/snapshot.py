import asyncio
import aiohttp

class Snapshot:
    filename = 'fk_test.ts'

    async def update(self):
        async with aiohttp.ClientSession() as session:
            async with session.get('http://simula.gunkies.org:9094/frikanalen.ts') as resp:
                with open(self.filename, 'wb') as fd:
                    while fd.tell() <= 10000000:
                        chunk = await resp.content.read(1024)
                        if not chunk:
                            break
                        fd.write(chunk)

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(Snapshot.update())
