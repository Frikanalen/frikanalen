#!/usr/bin/env sh

./manage.py collectstatic --noinput
./manage.py migrate
gunicorn fkweb.wsgi:application --bind 0.0.0.0:8080
