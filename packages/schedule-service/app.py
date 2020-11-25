from flask import Flask
from flask import Response
from playout import playout_schedule
from database.schedule import Graphics
import copy
import jsonpickle
import json

def add_graphics(video_list):
    def pairwise(iterable):
        "s -> (s0,s1), (s1,s2), (s2, s3), ..."
        a, b = tee(iterable)
        next(b, None)
        return zip(a, b)

    graphics = []

    for v, w in pairwise(video_list['items']):
        g = Graphics()
        g.end_time = copy.deepcopy(w.start_time)
        g.start_time = copy.deepcopy(v.end_time)
        duration = int((g.end_time - g.start_time).total_seconds() * 1000)
        g.URL = f'https://frikanalen.no/graphics/?duration={duration}'
        graphics.append(g)

    video_list['items'] = sorted(video_list['items'] + graphics, key=lambda x: x.start_time)
    return video_list

app = Flask(__name__)

@app.route('/playout')
def playoutschedule():
    video_list = playout_schedule()
    return Response(\
            jsonpickle.encode(add_graphics(video_list),unpicklable=False),
            mimetype='application/json'
            )



from itertools import tee


if __name__=="__main__":
    graphics = []
    video_list = playout_schedule()

