FROM python:3.8-alpine

MAINTAINER Tore Sinding Bekkedal <toresbe@protonmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN apk add py3-pillow && pip install --no-cache-dir -r requirements.txt
ENV PYTHONPATH /usr/lib/python3.8/site-packages

COPY . /usr/src/app

EXPOSE 80

CMD [ "gunicorn", "-b", "0.0.0.0:80", "app:app" ]
