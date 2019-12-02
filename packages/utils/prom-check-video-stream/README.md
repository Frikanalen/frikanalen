Transport stream analyzer for prometheus

So far, all this does is sleep, grab a chunk of TS data from the cubemap on simula, and 
log mean audio level.

Requires tsanalyze and ffmpeg.
## Install

```
apt-get install virtualenv
virtualenv -p python3 env
. env/bin/activate
pip install -r requirements.txt
```

##TODO


* Better deployment
* Video motion analysis (still image detection)
* Transport stream statistics (tsanalyze?)
