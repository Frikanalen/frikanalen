FROM tusproject/tusd


USER root
RUN apk add py3-pip
RUN pip3 install requests kafka-python
USER tusd
COPY hooks /srv/tusd-hooks
CMD ["-behind-proxy","-s3-bucket","incoming","-s3-endpoint","http://rook-ceph-rgw-media-store.rook-ceph","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
