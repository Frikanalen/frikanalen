Frikanalen
==========

Tools and web for the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

[GitHub page](http://github.com/Frikanalen/) | [Project mailing list](http://lists.nuug.no/mailman/listinfo/frikanalen/)

This repository is home to all the software used by Frikanalen. The main [packages](packages/) are:

- [frontend](packages/frontend) - Our new frontend, under active development
- [fkweb](packages/fkweb) - A Django site that serves as our API and legacy front-end
- [playout](packages/playout) - The CasparCG controller that manages our channel
- [fkupload](packages/fkupload) - Upload backend (the frontend is in fkweb) taking files from users
- [fkprocess](packages/fkprocess) - The processing backend for the files
- [utils](packages/utils) - Small utilities, microservices and helpers, and things we find no other place for
    - [atem-control-service](packages/utils/atem-control-service) - Microservice to control our production switcher
    - [nagios-check-video-stream](packages/utils/nagios-check-video-stream) - Legacy checker for video stream (Prometheus rewrite in progress)
    - [obe-service](packages/utils/obe-service) - systemd wrapper for Open Broadcast Encoder
    - [prom-check-video-stream](packages/utils/prom-check-video-stream) - New checker for video stream (incomplete)
    - [stream-multicast](packages/utils/stream-multicast) - systemd wrapper for multicast stream
    - [test-videos-generator](packages/utils/test-videos-generator) - generate test videos for local development
    - [transcode-obe-to-webm-stream](packages/utils/transcode-obe-to-webm-stream) - systemd wrapper for transcoding to WebM for legacy frontend

Of note is also [our infrastructure Ansible setup](infra/).

Some folders have a basic README file.

## Getting in touch / involved

Frikanalen is actively seeking volunteers who want to be part of building our unique service.

If you're curious about the project, please get in touch on our IRC channel #frikanalen on Freenode, or #dev:frikanalen.no on Matrix.

Tech lead for the project is [Tore Sinding Bekkedal](https://github.com/toresbe/) and he can be reached [by mail](mailto:toresbe@gmail.com) as well.

## Current development focus
 
- Migrating the remaining bare-metal services to Kubernetes
    - Ceph cluster up and running nicely, need to copy media from ZFS
    - Media asset server pulling from Ceph
    - Upload receiver and file mover/processer needs moving
- Filling airtime in a better way
    - New, far more maintainable playout written and deployed
    - Needs to add better instrumentalization, monitoring/alerting
- We are writing a new front-end
    - Migrating functionality from legacy site: Almost completely done
    - Still needs schedule planner

License
-------
All under the GNU LGPL license, see the file [COPYING](COPYING) for more details.
