import os

import requests


FK_API = os.environ.get('FK_API', 'http://beta.frikanalen.no/api')
FK_TOKEN = os.environ.get('FK_TOKEN')


class UploadError(Exception):
    pass


_upload_token_cache = {}
def check_video(video_id, upload_token):
    if video_id not in _upload_token_cache:
        _upload_token_cache[video_id] = _get_video_token(video_id)
    if _upload_token_cache[video_id] != upload_token:
        raise UploadError('Your upload token "%s" is incorrect' % upload_token)


def _get_video_token(video_id):
    response = requests.get(
        '%s/videos/%d/upload_token.json' % (FK_API, video_id),
        headers={'Authorization': 'Token %s' % FK_TOKEN}
    )
    data = response.json()
    print(data)
    if response.status_code != 200:
        raise UploadError('Upstream gave %d' % response.status_code)
    if 'upload_token' not in data or not data['upload_token']:
        raise UploadError('Auth fail for video')
    return data['upload_token']


def handle_upload(forms, files, dest):
    if 'name' in forms:
        filename = forms['name']
    else:
        raise UploadError("Filename must be present")

    if 'chunk' in forms and 'chunks' in forms:
        chunk = int(forms['chunk'])
        total = int(forms['chunks'])
    else:
        chunk = 0
        total = 1

    first = chunk == 0
    last = chunk == total - 1

    destfile = os.path.join(dest, filename)
    if os.access(destfile, os.F_OK):
        raise UploadError("File already uploaded")

    tmpfile = os.path.join(dest, '{0}.part'.format(filename))
    try:
        with open(tmpfile, 'w+b' if first else 'ab') as fd:
            files['file'].save(fd)
        if last:
            os.rename(tmpfile, destfile)
    except:
        raise UploadError("Failed to write file.")
    return last and destfile or None
