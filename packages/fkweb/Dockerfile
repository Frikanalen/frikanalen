FROM python:3-buster as base

FROM base as builder

# Pull missing packages
RUN apt-get update
RUN apt-get install -y python python-pip libpq-dev python-dev

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen

ADD . /srv/frikanalen
WORKDIR /srv/frikanalen
RUN pip install -r requirements-prod.txt

FROM builder

ADD . /srv/frikanalen/

CMD ["gunicorn", "fkbeta.wsgi:application", "--bind", "0.0.0.0:8080"]

EXPOSE 8080
