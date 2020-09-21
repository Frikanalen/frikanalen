from flask import Flask
from flask import Response
from flask import request
from chargen import Poster
app = Flask(__name__)


def makePoster():
    if request.method == 'POST':
        print(request.is_json)
        args = request.get_json()
        print(args)
        heading = args['heading']
        text = args['text']
    else:
        heading = request.args.get('heading')
        text = request.args.get('text')

    return Poster({'heading': heading, 'text': text})

@app.route('/getPoster.rgba', methods=['GET', 'POST'])
def getRGBA():
    poster = makePoster()
    return Response(poster.getRGBA(), mimetype='image/x-rgb')

@app.route('/getPoster.png', methods=['GET', 'POST'])
def getPNG():
    poster = makePoster()
    return Response(poster.getPNG(), mimetype='image/png')
