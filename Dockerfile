FROM debian

# Pull missing packages
RUN apt-get update
RUN apt-get install -y python postgresql python-pip libpq-dev python-dev

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen
ADD requirements.txt /srv/frikanalen
ADD requirements-dev.txt /srv/frikanalen
ADD fkbeta /srv/frikanalen/fkbeta

WORKDIR /srv/frikanalen
RUN pip install -r requirements-dev.txt

WORKDIR /srv/frikanalen/fkbeta
RUN python manage.py migrate
RUN python manage.py loaddata frikanalen

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
