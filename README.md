Frikanalen
==========

All code used by the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

[GitHub page](http://github.com/Frikanalen/) | [Project mailing list](http://lists.nuug.no/mailman/listinfo/frikanalen/)

This repository is home to all the software used by Frikanalen. The main [packages](packages/) are:

- [frontend](packages/frontend) - Next.js\/React-based front-end, under active development
- [fkweb](packages/fkweb) - Django-based back end API server
- [playout](packages/playout) - Legacy playout (being phased out soon)
- [playout-ng](packages/playout-ng) - New playout (currently running in beta)
- [fkupload](packages/fkupload) - Upload backend (the frontend is in fkweb) taking files from users
- [fkprocess](packages/fkprocess) - The processing backend for the files
- [utils](packages/utils) - Small utilities, microservices and helpers, and things we find no other place for
    - [atem-control](packages/utils/atem-control) - Node.js backend to control sound/vision mixer
    - [nagios-check-video-stream](packages/utils/nagios-check-video-stream) - Legacy checker for video stream (Prometheus rewrite in progress)
    - [obe-service](packages/utils/obe-service) - systemd wrapper for Open Broadcast Encoder
    - [prom-check-video-stream](packages/utils/prom-check-video-stream) - New checker for video stream (incomplete)
    - [stream-multicast](packages/utils/stream-multicast) - systemd wrapper for multicast stream
    - [test-videos-generator](packages/utils/test-videos-generator) - generate test videos for local development
    - [transcode-obe-to-webm-stream](packages/utils/transcode-obe-to-webm-stream) - systemd wrapper for transcoding to WebM for legacy frontend

Of note is also [our infrastructure Ansible setup and Kubernetes CRDs](infra/).

Some folders have a basic README file of their own.

## Getting in touch / involved

Frikanalen is actively seeking volunteers who want to be part of building our unique service.

If you're curious about the project, please get in touch on our IRC channel #frikanalen on Freenode, or #dev:frikanalen.no on Matrix.

Tech lead for the project is [Tore Sinding Bekkedal](https://github.com/toresbe/) and he can be reached [by mail](mailto:toresbe@gmail.com) as well.

## Current development focus
 
- We are writing a new front-end
    - Migrating functionality from legacy site: Almost completely done!!
    - Still needs a user interface for organizations to add their shows to schedules
- Filling airtime in a better way
    - New, far more maintainable playout written and deployed
    - Needs to add better instrumentalization, monitoring/alerting
    - A better jukebox algorithm to prioritize fresher content and leave bigger gaps for graphics
    - Expand broadcast graphics (in React frontend) to more than just a "next programme" clock (twitter feed?)
- Migrating the remaining bare-metal services to Kubernetes
    - Ceph cluster up and running nicely, need to migrate media from ZFS pool
    - Media asset server serving from Ceph
    - Upload receiver and file mover/processer migrating from systemd/SMB shares to k8s/Ceph
    - Docker container is very much needed for Open Broadcast Encoder (curmudgeonly build process)
    - CasparCG deployed as Docker container - not necessarily in k8s though
    
## Nice to have in the future:

- It would be great to implement a transport stream analysis for Prometheus (so we can alert on irregularities)
- It would be useful to have programmatically-generated test data for fkweb (so we can test and develop on realistic but anonymous data)
- It would be very nice to be able to deploy our CRDs directly in the cloud (using some sort of templating?)
- We should consider migrating to Istio - because it's, like, super neat

License
-------
All under the GNU LGPL license, see the file [COPYING](COPYING) for more details.
