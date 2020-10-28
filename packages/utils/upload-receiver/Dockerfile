FROM tusproject/tusd

COPY hooks /srv/tusd-hooks

USER root
RUN apk add py3-pip
RUN pip3 install requests kafka-python
USER tusd
CMD ["-behind-proxy","-hooks-dir","/srv/tusd-hooks","-base-path","/api/videos/upload"]
