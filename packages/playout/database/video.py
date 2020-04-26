LEGACY_API='https://forrige.frikanalen.no/api/'

import logging
import requests

class VideoFiles():
    def __init__(self, video_id):
        self.video_id = video_id

    # file_type is the old "fsname"; eg "broadcast" or "original"
    def __getitem__(self, file_type):
        params = {'video_id': self.video_id, 'format__fsname': file_type}
        res = requests.get(LEGACY_API + 'videofiles', params=params)
        if res.status_code != requests.codes.ok:
            raise Exception("Could not get videofiles from API, HTTP %d".format(res.status_code))
        try:
            data = res.json()
        except Exception:
            raise

        if data['count'] == 0:
            return None

        if data['count'] > 1:
            logging.warning("<1 videofiles returned for video %d type %s, returning 1"\
                    .format(self.video_id, file_type))

        return(data['results'][0]['filename'])

class Video():
    def __init__(self, video_id):
        self.video_id = video_id
        self.files = VideoFiles(video_id)


if __name__=='__main__':
    v = Video(626375)
    print(v.files['broadcast'])
