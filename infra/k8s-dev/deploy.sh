#!/usr/bin/env bash
k="microk8s kubectl"
export BASEPATH="../k8s"

echo "Creating backend namespace"

$k apply -f $BASEPATH/database/000-namespace.yaml

echo "Creating database/backend secrets"

SECRET_KEY=$(base64 /dev/urandom | head -c50)
DATABASE_PASS=$(pwgen 32 1)

$k apply secret -n database generic backend-secrets \
    --from-literal=SECRET_KEY=${SECRET_KEY} \
    --from-literal=DATABASE_PASS=${DATABASE_PASS} \

$k apply secret -n default generic backend-secrets \
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

echo "Opening ingress..."

$k apply -f ingress-service.yaml
$k apply -f ingress-backend.yaml



#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda_with_jukebox.yaml
#$k apply -f $BASEPATH/django/periodic-schedule-tasks/001-fill_agenda.yaml
