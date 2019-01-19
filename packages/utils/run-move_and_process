#!/bin/bash

dir=${BASH_SOURCE%/*}

set -x

mkdir -p tank/indir/1234 tank/outdir

cp tests/data/white-sine.ogv tank/indir/1234

$dir/move_and_process.py run \
	--indir `pwd`/tank/indir \
	--outdir `pwd`/tank/outdir \
	--no-api
