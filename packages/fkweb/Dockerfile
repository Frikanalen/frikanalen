FROM debian

# Pull missing packages
RUN apt-get update
RUN apt-get install -y python postgresql python-pip libpq-dev python-dev

# Copy over the files we need to start
RUN mkdir -p /srv/frikanalen
ADD . /srv/frikanalen/

WORKDIR /srv/frikanalen
RUN pip install -r requirements-dev.txt

RUN ./manage.py migrate
RUN ./manage.py loaddata frikanalen

CMD ["./manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
