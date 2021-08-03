#!/usr/bin/env bash
k="microk8s kubectl"
export BASEPATH="../k8s"

echo "Enabling required addons"

microk8s enable dns storage traefik linkerd metallb fluentd

echo "Customizing traefik to play nice with metallb"

$k apply -f traefik.yaml

echo "Opening ingresses..."

$k apply -f ingress.yaml


echo "Adding cluster-internal DNS alias for fk.dev.local->ingress.traefik"

$k apply -f coredns-config.yaml

echo "Creating backend namespace"

$k apply -f $BASEPATH/database/000-namespace.yaml

echo "Creating database/backend secrets"

SECRET_KEY=$(base64 /dev/urandom | head -c50)
DATABASE_PASS=$(pwgen 32 1)

$k create secret -n database generic backend-secrets \
    --from-literal=SECRET_KEY=${SECRET_KEY} \
    --from-literal=DATABASE_PASS=${DATABASE_PASS} \

$k create secret -n default generic backend-secrets \
    --from-literal=SECRET_KEY=${SECRET_KEY} \
    --from-literal=DATABASE_PASS=${DATABASE_PASS} \

echo "Creating database storage"

$k apply -f database-storage.yaml

echo "Applying database CRDs..."

$k apply -f $BASEPATH/database/001-deployment.yaml
$k apply -f $BASEPATH/database/002-service.yaml

echo "Starting backend..."

$k apply -f $BASEPATH/django/000-nginx-config.yaml
$k apply -f $BASEPATH/django/001-deployment.yaml
$k apply -f $BASEPATH/django/002-service.yaml


echo "Waiting for Django to come up"
sleep 20
DJANGO_POD=$(kubectl get pods --selector=app=django --output=jsonpath={.items..metadata.name})
DSP=$(pwgen 32 1)
echo "Creating upload superuser"
k exec -ti $DJANGO_POD -c django -- DJANGO_SUPERUSER_PASSWORD=${DSP} env ./manage.py createsuperuser --date_of_birth 1970-01-01 --email upload@frikanalen.no --no-input
echo "Obtaining token"
FK_TOKEN=$(curl -u upload@frikanalen.no:${DSP} http://fk.dev.local/api/obtain-token | jq -r .key)

# These are statically defined by s3-ninja, afaict

AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

$k create secret -n default generic upload-receiver \
    --from-literal=AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    --from-literal=AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    --from-literal=AWS_REGION=no-where-1 \
    --from-literal=FK_TOKEN=${FK_TOKEN}

#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda_with_jukebox.yaml
#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda.yaml
