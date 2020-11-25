from flask import Flask
from flask import Response
from playout import playout_schedule
import jsonpickle

app = Flask(__name__)

@app.route('/playout')
def playoutschedule():
    video_list = playout_schedule()
    return Response(\
            jsonpickle.encode(video_list,unpicklable=False),
            mimetype='application/json'
            )
