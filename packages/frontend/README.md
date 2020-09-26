# Frikanalen web frontend

![Build frontend package](https://github.com/Frikanalen/frikanalen/workflows/Build%20frontend%20package/badge.svg)

This is the new frontend, under active development.

It can be reached at frikanalen.no.

## Running locally:

First, install the dependencies (obviously this requires yarn)

`yarn install`

Then there are two profiles to choose from; either 

* `yarn run dev` - if you are using a local Django instance (in which case it will expect to find it at `localhost:8080`), or 
* `yarn run staging` - to run the frontend against the production backend API.
