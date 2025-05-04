FROM python:3.6-buster AS base

FROM base AS builder

# Pull missing packages
RUN apt-get update && apt-get install -y python3 python3-pip python3-psycopg2

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen

ADD requirements.txt /srv/frikanalen

WORKDIR /srv/frikanalen
RUN pip install -r requirements.txt

FROM builder

ADD . /srv/frikanalen/

CMD ["./start.sh"]

EXPOSE 8080
