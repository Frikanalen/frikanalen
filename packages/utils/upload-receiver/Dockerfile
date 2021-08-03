FROM tusproject/tusd


USER root
RUN apk add py3-pip
RUN pip3 install requests kafka-python
USER tusd
COPY hooks /srv/tusd-hooks
CMD ["-behind-proxy","-s3-bucket","incoming","-s3-endpoint","http://s3-backend.default","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
