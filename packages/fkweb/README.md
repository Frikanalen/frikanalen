fkweb
=====

![Unit tests](https://github.com/Frikanalen/frikanalen/workflows/Unit%20test%20Django%20API%20service/badge.svg)
![Build fkweb](https://github.com/Frikanalen/frikanalen/workflows/Build%20Django%20backend%20service/badge.svg)

Backend API for the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

Non-HTTP entry points
---------------------

In addition to the HTTP API, the following commands are executed periodically as Kubernetes cron jobs in our cluster:

    $ ./manage.py fill_next_weeks_agenda

This job will fill the next week's schedule with videos as defined by the WeeklySlot model. This will generally be entries like "Fill Mondays 12-13 with the latest videos from NUUG".

    $ ./manage.py fill_agenda_with_jukebox
    
This job will fill the remaining unpopulated areas with videos as randomly selected from the set of all videos marked with is_filler=True.

Creating a local development environment
----------------------------------------

Let's start by installing some of the dependencies, creating a virtual environment and activating it:

    $ apt install sqlite3 python3-virtualenv python3-pip
    $ python3 -m venv env
    $ source env/bin/activate
    (env)$

Use pip to install the rest of the requirements:

    (env)$ pip install -r requirements-dev.txt

Open fkweb/settings.py in your editor and edit paths and database settings.
You should set `SECRET_KEY` to a random string.

Initialize the database:

    (env)$ ./manage.py migrate
        ...

Load some default data (fixtures) into the database:

    (env)$ ./manage.py loaddata frikanalen
        ...

Create a new admin user:

    (env)$ ./manage.py createsuperuser

Start the webserver:

    (env)$ ./manage.py runserver

Point your browser to http://127.0.0.1:8080/admin and log in.

### Docker

If you want to use docker, the following commands should set you up:

    $ docker build -t "frikanalen" .
    $ docker run -p 8080:8080 frikanalen

Alternatively you can pull down a image from Docker Hub:

    $ docker run -p 8080:8080 frikanalen/frikanalen

For more advanced things you'd want to check [our infrastructure Ansible setup](../../infra/).
