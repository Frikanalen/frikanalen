This utility receives an HTTP stream from ffmpeg running as a bare-metal systemd service on tx1, which is fed by an AUX on the production switcher.

Systemd file is in this directory for safe keeping.

It then serves it via websockets using jsmpeg, which is really neat because it saves us having to deal with the monster that is WebRTC.
