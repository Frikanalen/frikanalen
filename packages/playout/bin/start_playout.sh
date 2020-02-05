#!/bin/sh

while true
do
  uptime >> ~/playout_start.log
  python bin/integrated.py
  sleep 5
done
