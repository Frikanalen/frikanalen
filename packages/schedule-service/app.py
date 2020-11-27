from flask import Flask
from flask import Response
from playout import playout_schedule
import jsonpickle
import json

app = Flask(__name__)

@app.route('/playout')
def playoutschedule():
    video_list = playout_schedule()
    return Response(\
            jsonpickle.encode(video_list,unpicklable=False),
            mimetype='application/json'
            )


if __name__=="__main__":
    graphics = []
    video_list = playout_schedule()
    print(json.dumps(json.loads(jsonpickle.encode(video_list,unpicklable=False)), indent=2))

