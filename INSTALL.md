Creating a local development environment
========================================

Let's start by installing some of the dependencies by running the
`install-debian-deps.sh`.

Create virtual env:

    $ virtualenv env

Activate your new python environment:

    $ source env/bin/activate
    (env)$

Use pip to install the rest of the requirements:

    (env)$ pip install -r requirements.txt

Open fkbeta/settings.py in your editor and edit paths and database-settings.
You should set SECRET_KEY to a random string.

Initialize the database:

    (env)$ cd fkbeta
    (env)$ python manage.py migrate
        ...

Load some default data (fixtures) into the database:

    (env)$ python manage.py loaddata frikanalen
        ...

Create a new admin user:

    (env)$ python manage.py createsuperuser

Start the webserver:

    (env)$ python manage.py runserver

Point your browser to http://127.0.0.1:8000/admin and log in.

## Docker

If you want to use docker, the following commands should set you up:

    $ docker build -t "frikanalen" .
    $ docker run -p 8000:8000 frikanalen

Alternatively you can pull down a image from Docker Hub:

    $ docker run -p 8000:8000 frikanalen/frikanalen
