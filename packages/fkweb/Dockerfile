FROM python:3-buster as base

FROM base as builder

# Pull missing packages
RUN apt-get update && apt-get install -y python3 python3-pip libpq-dev python3-dev

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen

ADD requirements-prod.txt /srv/frikanalen
ADD requirements.txt /srv/frikanalen

WORKDIR /srv/frikanalen
RUN pip install -r requirements-prod.txt

FROM builder

ADD . /srv/frikanalen/

CMD ["gunicorn", "fkweb.wsgi:application", "--bind", "0.0.0.0:8080"]

EXPOSE 8080
