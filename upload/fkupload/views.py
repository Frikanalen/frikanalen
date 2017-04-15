#!/usr/bin/env python3
# Flask app to upload files to Frikanalen
import os
import json

from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

from .utils import handle_upload
from .utils import UploadError


app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload():
    video_id = request.values.get('video_id', 0)
    if not video_id:
        return jsonify({'error': 'Missing video_id'}), 400
    dest_dir = os.path.join(UPLOAD_DIR, video_id)
    os.makedirs(dest_dir, exist_ok=True)
    try:
        finished = handle_upload(request.values, request.files, dest_dir)
    except UploadError as e:
        return jsonify({'error': e.message}), 400
    return jsonify({'status': 'ok'} if finished else {})


@app.route('/')
def home():
    return render_template('upload.html')
