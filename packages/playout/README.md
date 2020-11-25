# Frikanalen TV playout

(This version is in the course of being deprecated. Please look at ../playout-ng in the playout-ng branch.)

## Trying it out

The frikanalen playout requires an instance of CasparCG running and accessible on port 5250.

It also requires a few static files to be present. 

    # Navigate to your CasparCG's media directory (yours might be somewhere else!)
    cd casparserver/media
    mkdir filler stills
    
    # At the time of writing you will have to add --no-check-certificate
    wget -P filler/ https://file01.frikanalen.no/media/filler/FrikanalenLoop.avi \
                    https://file01.frikanalen.no/media/filler/FrikanalenVignett.avi
    wget -P stills  https://file01.frikanalen.no/media/stills/screenbug.png

    # Create a virtual environment to install the python dependencies
    virtualenv -p python3 env

    # Activate the environment
    . env/bin/activate

    # Install the requirements
    pip install -r requirements.txt

    # And try the software
    ./fk-playout-service

Or you can install it from Docker:

    docker run toresbe/fk-playout
