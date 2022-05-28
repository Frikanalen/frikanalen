#!/usr/bin/bash

POSTGRES_PASSWORD=$(pwgen 30 1)
POSTGRES_REPLICATION_PASSWORD=$(pwgen 30 1)
DATABASE_URL=postgres://fk:${POSTGRES_PASSWORD}@postgres/fk

kubectl create -n beta secret generic database --from-literal=DATABASE_URL=${DATABASE_URL} --from-literal=POSTGRES_PASSWORD=${POSTGRES_PASSWORD} --from-literal=POSTGRES_REPLICATION_PASSWORD=${POSTGRES_REPLICATION_PASSWORD}

FK_API_KEY=$(pwgen 30 1)
kubectl create -n beta secret generic fk-api-key --from-literal=FK_API_KEY=${FK_API_KEY}
