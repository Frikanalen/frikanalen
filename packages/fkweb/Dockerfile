FROM python:3.10-alpine3.20 AS base

RUN apk add --no-cache python3 poetry postgresql-dev python3-dev

FROM base AS builder

WORKDIR /srv/frikanalen

COPY poetry.lock .
COPY pyproject.toml .

RUN poetry install

FROM builder

COPY . .

RUN poetry install --no-root

CMD ["poetry", "run", "./start.sh"]

EXPOSE 8080
