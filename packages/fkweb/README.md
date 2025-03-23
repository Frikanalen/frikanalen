# fkweb

![Unit tests](https://github.com/Frikanalen/frikanalen/workflows/Unit%20test%20Django%20API%20service/badge.svg)
![Build fkweb](https://github.com/Frikanalen/frikanalen/workflows/Build%20Django%20backend%20service/badge.svg)

Backend API for the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

## Configuration

The backend is configured using environment variables.

- ALLOWED_HOSTS - comma-separated list of permitted domains
- DATABASE_USER - postgres username
- DATABASE_NAME - postgres db name
- DATABASE_PASS - postgres password
- SMTP_SERVER - smtp server for outgoing email

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

#### Initializing dev environment

Install the [uv package manager](https://docs.astral.sh/uv/getting-started/installation/).

```sh
# Create the virtual environment
uv venv
# Activate it
source .venv/bin/activate
# Install the packages in the lockfile
uv sync
```

#### Initializing database

```sh
# Spin up PostgreSQL in Docker; web interface now at localhost:8082
docker-compose up -d
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

- dev-admin@frikanalen.no _site administrator_
- dev-org1-admin@frikanalen.no _administrator for org1_
- dev-org1-member@frikanalen.no _member of org1_
- dev-org2-admin@frikanalen.no _administrator for org2_

For more advanced things you'd want to check [our infrastructure Ansible setup](../../infra/README.md).
