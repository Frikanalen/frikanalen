FROM tusproject/tusd

USER root
COPY requirements.txt .

RUN apk add py3-pip
RUN pip3 install -r requirements.txt

USER tusd

COPY hooks /srv/tusd-hooks
CMD ["-behind-proxy","-s3-bucket","incoming","-s3-endpoint","http://s3-backend","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
