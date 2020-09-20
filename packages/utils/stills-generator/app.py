from flask import Flask
from flask import Response
from flask import request
from chargen import CharacterGenerator
app = Flask(__name__)

cg = CharacterGenerator()

@app.route('/getPoster.png', methods=['GET', 'POST'])
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

    return Response(cg.render(heading, text), mimetype='image/png')
