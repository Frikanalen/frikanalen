#!/usr/bin/env bash

docker build -t frikanalen/atem-control . || exit 1
docker push frikanalen/atem-control || exit 1
ssh simula kubectl rollout restart deployment atem-control
ssh simula kubectl rollout status deployment atem-control
