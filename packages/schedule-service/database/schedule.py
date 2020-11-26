import psycopg2
from datetime import datetime, timedelta

class Organization():
    def __init__(self, ID, name):
        self.ID = ID
        self.name = name

class Video():
    def __init__(self, ID, name, framerate):
        self.ID = ID
        self.name = name
        self.framerate = framerate
        self.CRID = "crid://frikanalen.no/{}".format(ID)

    def __repr__(self):
        return "Video[ID={},name=\"{}\"]".format(self.ID, self.name)

class ScheduleItem():
    def __repr__(self):
        s = "ScheduleItem["
        if self.start_time and self.end_time:
            s += self.start_time.strftime("[%d %H:%M-")
            s += self.end_time.strftime("%H:%M]")
        if self.video:
            s += self.video.__repr__()
        s += "]"
        return s

    def __init__(self):
        self.video = None
        self.start_time = None
        self.end_time = None
        self.organization = None

class ScheduledVideo(ScheduleItem):
    def __getstate__(self):
        return {
                'videoID': self.video.ID,
                'startTime': self.start_time,
                'endTime': self.end_time,
                'framerate': self.video.framerate,
                'name': self.video.name,
                'type': 'video'
                }

class Graphics(ScheduleItem):
    def __getstate__(self):
        return {
                'url': self.URL,
                'startTime': self.start_time,
                'endTime': self.end_time,
                'type': 'graphics',
                }

class Schedule():
    def _build_conn_string(self):
        """ Placeholder function; TODO: get these from envs"""
        return "dbname=fkweb password=temporary host=10.244.2.228 user=fkschedule"

    def __init__(self):
        self.conn = psycopg2.connect(self._build_conn_string())

    def get_date(self, date):
        date_str = "%04d-%02d-%02d" % (date.year, date.month, date.day)
        print(date_str)
        query = """
            SELECT
                i.video_id,
                v.name as video_name,
                v.organization_id,
                o.name as organization_name,
                i.schedulereason,
                v.framerate,
                i.starttime,
                (i.starttime + i.duration) as endtime
            FROM fk_scheduleitem AS i
            JOIN fk_video AS v ON (video_id = v.id)
            JOIN fk_organization AS o ON (v.organization_id = o.id)
            WHERE (date_trunc('day', i.starttime) = 
                date_trunc('day', %s))
            ORDER BY i.starttime ASC;"""
        cur = self.conn.cursor()
        cur.execute(query, (date,))
        schedule_data = cur.fetchall()
        schedule = {}
        schedule['date'] = date
        schedule['items'] = []
        for item in schedule_data:
            new_item = ScheduledVideo()
            new_item.video = Video(ID = item[0], name = item[1], framerate = item[5])
            new_item.organization = Organization(ID = item[2], name = item[3])
            new_item.reason = item[4]
            new_item.start_time = item[6]
            new_item.end_time = item[7]
            new_item.CRID = "crid://frikanalen.no/%d" % (item[0],)
            schedule['items'].append(new_item)
        return schedule

if __name__=="__main__":
    s = Schedule()
    print(s.get_date(datetime.now()))
    

