Frikanalen
==========

All code used by the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

[GitHub page](http://github.com/Frikanalen/) | [Project mailing list](http://lists.nuug.no/mailman/listinfo/frikanalen/)

This repository is home to all the software used by Frikanalen. The main [packages](packages/) are:

- [frontend](packages/frontend) - Next.js\/React-based front-end, under active development
- [fkweb](packages/fkweb) - Django-based back end API server
- [playout](packages/playout) - Playout
- [fkupload](packages/fkupload) - Upload backend (the frontend is in fkweb) taking files from users
- [fkprocess](packages/fkprocess) - The processing backend for the files
- [utils](packages/utils) - Small utilities, microservices and helpers, and things we find no other place for
    - [atem-control](packages/utils/atem-control) - Node.js backend to control sound/vision mixer
    - [obe-service](packages/utils/obe-service) - systemd wrapper for Open Broadcast Encoder
    - [prom-check-video-stream](packages/utils/prom-check-video-stream) - New checker for video stream (incomplete)
    - [test-videos-generator](packages/utils/test-videos-generator) - generate test videos for local development
    - [stills-generator](packages/utils/stills-generator) - renders stills for upload to atem via atem-control
    - [upload-receiver](packages/utils/upload-receiver) - next-generation fkupload


Of note is also [our infrastructure Ansible setup and Kubernetes CRDs](infra/).

Some folders have a basic README file of their own.

## Getting in touch / involved

Frikanalen is actively seeking volunteers who want to be part of building our unique service.

If you're curious about the project, please get in touch on our IRC channel #frikanalen on OFTC.

Tech lead for the project is [Tore Sinding Bekkedal](https://github.com/toresbe/) and he can be reached [by mail](mailto:toresbe@protonmail.com) as well.

## Functional description

### Video ingest

Frikanalen uses the tus protocol for file upload, the same as eg. Vimeo.
tus was chosen because it seemed to have robust and well-maintained client and server code, and it was found to be extremely easy to adapt for our needs.
A video database entry is created or obtained through /api/videos, which will also give the user an upload token.

The tusd service is exposed at https://frikanalen.no/api/videos/upload.
tusd searches for a hook script named "pre-create", and if it exists it will be used to authenticate an upload request.
A JSON representation of the request is piped into stdin, and tusd uses pre-create's exit code is to determine whether authentication succeeded.
We have a small Python script which authenticates the video upload token against the video id database entry.
A larger Python script is "post-finish", which is called after the successful completion of an upload.

post-finish sends out the message to the other encoders that a new file has arrived.
Among other things, post-finish gets the video ID and object storage reference from tusd as JSON.
post-finish obtains the video ID, original filename and file asset location.
This is used to generate a well defined Kafka message and writes a Kafka message is sent to the topic new-file-uploaded.

```
{
  "version": "1",
  "video_id": "626739",
  "orig_filename": "IMG_1133.MOV",
  "s3_key": "82210c2c00b0230ea6a903bfed927162"
}
```

s3_key is the object key in the "incoming" bucket of our Ceph/Rook/Rados object store, accessed by the S3 API.
This tells all consumers subscribing to this topic that a new file is available, and where to find it.

This gives us a versatile framework for working with video uploads and processing; any new encoding pipeline can simply
be assigned a new consumer group ID, and Kafka will keep track of the last message that was acknowledged as
processed - committed, in Kafka parlance - by a given processing step.

To preclude the possibility of invalid files gumming up the works,
a probable future improvement will be to insert a validation step between video reception, and subsequent processing.

The following consumers are planned:

#### copy-to-legacy

To ensure a smooth transition, the first of these consumer groups is "copy-to-legacy".
copy-to-legacy will simply copy the file to file01 using scp, and move it into place.
Essentially spoofing the old upload receiver, it renames follows its interface by creating a directory with a name given by "video_id",
dumping the object into a file with the original filename as given by "orig_filename",
and moving this tree into /srv/fkupload/finished_uploads, eg. as "639157/Ep341.mp4".

I'm not sure by what mechanism, but this will generate various video files. "theora", "thumbnail", "broadcast".
These then appear in the database as videofile entries.

### ingest_incoming

*Not yet implemented.*

This copies the file into the "original" bucket of our object store and creates a video asset record on the backend.

License
-------
All under the GNU LGPL license, see the file [COPYING](COPYING) for more details.
