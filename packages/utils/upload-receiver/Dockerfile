FROM tusproject/tusd

USER root
COPY requirements.txt .

RUN apk add py3-pip py3-paramiko py3-requests

USER tusd

COPY hooks /srv/tusd-hooks
CMD ["-behind-proxy","--hooks-enabled-events","pre-create,pre-finish","-upload-dir","./upload-tmp","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
