#!/usr/bin/env python3
# Flask app to upload files to Frikanalen
import os
import json

from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

from .utils import UploadError
from .utils import check_video
from .utils import handle_upload


UPLOAD_DIR = os.environ.get('UPLOAD_DIR', os.path.join(
    os.getcwd(), 'upload_files'))
FINISHED_DIR = os.environ.get('FINISHED_DIR', os.path.join(
    UPLOAD_DIR, 'finished'))

app = Flask(__name__)


def upload_err(func):
    def decorator(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except UploadError as e:
            return jsonify({'error': str(e)}), 400
    return decorator


@app.route('/upload', methods=['POST'])
@upload_err
def upload():
    try:
        video_id = int(request.values['video_id'])
    except:
        raise UploadError('Missing video_id')
    check_video(video_id, request.values.get('upload_token'))
    dest_dir = os.path.join(UPLOAD_DIR, str(video_id))
    os.makedirs(dest_dir, exist_ok=True)
    finished = handle_upload(request.values, request.files, dest_dir)
    if finished:
        final_dir = os.path.join(FINISHED_DIR, str(video_id))
        os.renames(dest_dir, final_dir)
    return jsonify({'finished': bool(finished)})


@app.route('/')
def home():
    return render_template('upload.html')
