#!/usr/bin/env bash
k="microk8s kubectl"
export BASEPATH="../k8s"

sudo apt install jq curl pwgen 

echo "Enabling required addons"

microk8s enable dns storage traefik linkerd metallb fluentd rbac

echo "Customizing traefik to play nice with metallb"

$k apply -f traefik.yaml
$k apply -f $BASEPATH/ingress/000-crds.yaml
$k apply -f $BASEPATH/ingress/000-rbac.yaml

echo "Opening ingresses..."

$k apply -f ingress.yaml

echo "Adding cluster-internal DNS alias for fk.dev.local->ingress.traefik"

$k apply -f coredns-config.yaml

echo "Creating backend namespace"

$k apply -f $BASEPATH/database/000-namespace.yaml

if ! $k get secret django-secret-key 2> /dev/null; then
    echo "Creating Django SECRET_KEY"

    SECRET_KEY=$(base64 /dev/urandom | head -c50)

    $k create secret generic django-secret-key \
        --from-literal=SECRET_KEY=${SECRET_KEY}
else
    echo "Django SECRET_KEY already exists, not generating..."
fi;

if ! $k get secret database-api-secret 2> /dev/null; then
    echo "Creating database/backend secrets"

    POSTGRES_REPLICATION_PASSWORD=$(pwgen 32 1)
    POSTGRES_PASSWORD=$(pwgen 32 1)
    DATABASE_URL="postgres://fkweb:${POSTGRES_PASSWORD}@database-api/fkweb"
    FKSCHEDULE_PASSWORD=$(pwgen 32 1)

    $k create secret generic database-api-secret \
        --from-literal=POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
        --from-literal=DATABASE_URL=${DATABASE_URL} \
        --from-literal=FKSCHEDULE_PASSWORD=${FKSCHEDULE_PASSWORD} \
        --from-literal=POSTGRES_REPLICATION_PASSWORD=${POSTGRES_REPLICATION_PASSWORD}
else
    echo "Database secrets already exist, not generating..."
fi;

echo "Applying database CRDs..."

$k apply -f $BASEPATH/operators/kubegres-1.8.yaml
$k apply -f database.yaml

echo "Starting backend..."

$k apply -f $BASEPATH/django/django.yaml

echo "Waiting for Django to come up"
until curl -fs http://fk.dev.local/api> /dev/null; do sleep 1; echo -n .; done

if ! $k get secret upload-receiver 2> /dev/null; then
    echo "Creating upload superuser"

    DJANGO_POD=$($k get pods --selector=app=django --output=jsonpath={.items..metadata.name})
    DSP=$(pwgen 32 1)
    $k exec -ti $DJANGO_POD -c django -- DJANGO_SUPERUSER_PASSWORD=${DSP} env ./manage.py createsuperuser --date_of_birth 1970-01-01 --email upload@frikanalen.no --no-input

    echo "Obtaining token"

    FK_TOKEN=$(curl -u upload@frikanalen.no:${DSP} http://fk.dev.local/api/obtain-token | jq -r .key)

    echo "Writing upload-service secrets"

    # These are statically defined by s3-ninja, afaict
    AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
    AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

    $k create secret -n default generic upload-receiver \
        --from-literal=AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
        --from-literal=AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
        --from-literal=AWS_REGION=no-where-1 \
        --from-literal=FK_TOKEN=${FK_TOKEN}

else
    echo "Skipping upload receiver configuration"
fi;

echo "Setting up Kafka..."
$k apply -f zookeeper.yaml

echo "Starting upload-receiver service"

# TODO: Move environment into config map
$k apply -f $BASEPATH/ingest/upload-receiver/upload-receiver.yaml

#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda_with_jukebox.yaml
#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda.yaml

echo "Starting S3 emulation service"
$k apply -f s3-emulator.yaml
