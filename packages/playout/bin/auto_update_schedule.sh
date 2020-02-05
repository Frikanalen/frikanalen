#!/bin/bash
path="$(dirname "$0")"
python3 $path/fetch_and_pickle_schedule.py 10 $path/../cache/dailyplan/
$path/update_jukebox.sh
python3 $path/playout_reload_schedule.py localhost 8889
