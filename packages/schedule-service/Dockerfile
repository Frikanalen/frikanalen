FROM python:3-alpine as base

FROM base as builder

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen

ADD . /srv/frikanalen
WORKDIR /srv/frikanalen
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install -r requirements.txt

FROM builder

ADD . /srv/frikanalen/

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "80"]

EXPOSE 5000
