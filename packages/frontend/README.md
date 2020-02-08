Frikanalen web frontend
=

This is the new frontend, under active development.

It can be reached at beta.frikanalen.no.

To deploy:
--
* Install debian requirements (docker-compose, docker.io)
* Set up .env file
* docker-compose build
* docker-compose up -d

Sample .env file:
--
```
PORT=3002
API_URL=https://dev.frikanalen.no/api
GRAPHQL_URL=https://dev.frikanalen.no/graphql
```
