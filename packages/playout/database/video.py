LEGACY_API='https://frikanalen.no/api/'

import logging
import requests

class VideoFiles():
    def __init__(self, videoID):
        self.videoID = videoID

    # file_type is the old "fsname"; eg "broadcast" or "original"
    def __getitem__(self, file_type):
        params = {'video_id': self.videoID, 'format__fsname': file_type}
        res = requests.get(LEGACY_API + 'videofiles/', params=params)
        if res.status_code != requests.codes.ok:
            raise Exception("Could not get video files from API, HTTP %d".format(res.status_code))
        try:
            data = res.json()
        except Exception:
            raise

        if data['count'] == 0:
            return None

        if data['count'] > 1:
            logging.warning("<1 video files returned for video %d type %s, returning 1"\
                    .format(self.videoID, file_type))

        return(data['results'][0]['filename'])

class Video():
    def __init__(self, videoID):
        self.id = videoID
        self.files = VideoFiles(videoID)


if __name__=='__main__':
    v = Video(626375)
    print(v.files['broadcast'])
