Upload app
==========

This uploads files. It's a Flask app.

Run like:

    PYTHONPATH=. FLASK_APP=fkupload FLASK_DEBUG=1 flask run

Setup
-----

It uses Python3. Do this to install first time:

    python3 -m venv env
    . env/bin/activate
    pip install -r requirements.txt

The protocol
------------

The upload protocol uses POST to submit one or more chunks of the
video file to upload.  Included in each POST is the the video ID and
an upload token associated with the video ID and the filename of the
video file.

The token is fetched from the Frikanalen API using the
`https://frikanalen.no/api/videos/<video_id>/upload_token` end point.

Here is an example, a simple upload consisting of two chunks, sent as
multipart/form-data in the POST:

    post0 = {
        'video_id': '123',
        'upload_token': 'secret-hash',
        'name': 'some-file.dv',
        'file': <first-1M-chunk-of-file>
        'chunk': 0,
        'chunks': '2',
    }

    post1 = {
        'video_id': '123',
        'upload_token': 'secret-hash',
        'name': 'some-file.dv',
        'file': <last-1M-chunk-of-file>
        'chunk': 1,
        'chunks': '2',
    }

A good chunk size to use is 1 MiB.

Testing
-------

You can test uploading locally. First start the server:

    PYTHONPATH=. FLASK_APP=fkupload FLASK_DEBUG=1 FK_API=http://localhost:9999 flask run

You need to find your own file for upload or add a `mytest.jpeg`.

    echo -e "HTTP/1.0 200 OK\n\n{\"upload_token\": \"secret\"}" | nc -q1 -l 9999 &
    curl localhost:5000/upload \
        -X POST \
        -F 'file=@mytest.jpeg' \
        -F name='test.jpg' \
        -F video_id=1000 \
        -F upload_token=secret

You should get a reply with "{ finished: true }", you will find the file in
`upload_files/finished/1000/test.jpg` if everything went well.

If you upload something, you should chunk it up using chunk and chunks as
explained in "Protocol".
