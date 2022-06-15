FROM tusproject/tusd

USER root
COPY requirements.txt .

RUN apk add py3-pip
RUN pip3 install -r requirements.txt

USER tusd

COPY hooks /srv/tusd-hooks
CMD ["-behind-proxy","-upload-dir","./upload-tmp","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
