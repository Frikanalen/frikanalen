import psycopg2
import jsonpickle
from datetime import datetime, timedelta

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

class Database():
    def __init__(self, conn_string):
        self.conn = psycopg2.connect(conn_string)
        self.conn.cursor().execute("SET TIME ZONE 'Europe/Oslo';")

class Schedule():
    def __init__(self):
        self.db = Database()

    def get_for_date(self, date):
        date_str = "%04d-%02d-%02d" % (date.year, date.month, date.day)
        query = """
            SELECT
                i.video_id,
                v.name as video_name,
                v.framerate as framerate,
                v.organization_id,
                o.name as organization_name,
                i.schedulereason,
                i.starttime,
                (i.starttime + i.duration) as endtime
            FROM fk_scheduleitem AS i
            JOIN fk_video AS v ON (video_id = v.id)
            JOIN fk_organization AS o ON (v.organization_id = o.id)
            WHERE (date_trunc('day', i.starttime) = 
                date_trunc('day', %s))
            ORDER BY i.starttime ASC;"""
        cur = self.db.conn.cursor()
        cur.execute(query, (date,))
        schedule_data = cur.fetchall()
        schedule = {}
        schedule['date'] = date
        schedule['items'] = []
        for item in schedule_data:
            new_item = ScheduledVideo()
            new_item.video = Video(ID = item[0], name = item[1], framerate = item[2])
            new_item.organization = Organization(ID = item[3], name = item[3])
            new_item.reason = item[5]
            new_item.start_time = item[6]
            new_item.end_time = item[7]
            new_item.CRID = "crid://frikanalen.no/%d" % (item[0],)
            schedule['items'].append(new_item)
        return schedule

if __name__=="__main__":
    s = Schedule()
    print(s.get_for_date(datetime.now()))
    

