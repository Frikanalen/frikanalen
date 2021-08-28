fkweb
=====

![Unit tests](https://github.com/Frikanalen/frikanalen/workflows/Unit%20test%20Django%20API%20service/badge.svg)
![Build fkweb](https://github.com/Frikanalen/frikanalen/workflows/Build%20Django%20backend%20service/badge.svg)

Backend API for the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

## Configuration

The backend is configured using environment variables.

* ALLOWED_HOSTS - comma-separated list of permitted domains
* DATABASE_USER - postgres username
* DATABASE_NAME - postgres db name
* DATABASE_PASS - postgres password
* SMTP_SERVER - smtp server for outgoing email

## Installation

### Docker

This package builds on push as frikanalen/django-backend. To build a local copy:

```sh
docker build -t frikanalen/django-backend . 
```

Then you can run it thus:

```sh
docker run -p 8080:8080 frikanalen/django-backend 
```

### Local development

Create, populate and activate a virtual environment:
```sh
sudo apt install sqlite3 python3-virtualenv python3-pip
python3 -m venv env
source env/bin/activate
pip install -r requirements-dev.txt
```

Open `fkweb/settings.py` in your editor and edit paths and database settings.

You should set `SECRET_KEY` to a random string.

```sh
# Initialize the database
./manage.py migrate
# Load necessary fixtures (eg. content categories) into the database:
./manage.py loaddata frikanalen
```


**EITHER** Load the testing users and organizations:

```sh
./manage.py loaddata test-users
```

**OR** Create a new admin user:

```sh
./manage.py createsuperuser
```

Start the webserver:

```shell
./manage.py runserver
```

Point your browser to http://127.0.0.1:8000/admin and log in.

## Management commands

In addition to the HTTP API, the following commands are executed periodically as Kubernetes cron jobs in our cluster:

```sh
./manage.py fill_next_weeks_agenda
```

This job will fill the next week's schedule with videos as defined by the WeeklySlot model. This will generally be entries like "Fill Mondays 12-13 with the latest videos from NUUG".

```sh
./manage.py fill_agenda_with_jukebox
```
    
This job will fill the remaining unpopulated areas with videos as randomly selected from the set of all videos marked with is_filler=True.

## Test data

As a convenience a test data file has been supplied, eg. for integration testing.

It contains the following organizations:

- dev-org1
- dev-org2

Additionally, the following users:

- dev-admin@frikanalen.no *site administrator*
- dev-org1-admin@frikanalen.no *administrator for org1*
- dev-org1-member@frikanalen.no *member of org1*
- dev-org2-admin@frikanalen.no *administrator for org2*



For more advanced things you'd want to check [our infrastructure Ansible setup](../../infra/README.md).
