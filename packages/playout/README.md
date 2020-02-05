Frikanalen MLT TV playout
=========================

[![Documentation Status](https://readthedocs.org/projects/mltplayout/badge/?version=latest)](https://mltplayout.readthedocs.io/en/latest/?badge=latest)

The latest version of the source is available from
https://github.com/Frikanalen/mltplayout .

Trying it out
-------------

It's currently not that easy to try out. Hopefully it'll become easier to set
up in the future.  Right now we can give a few tips on how to proceed.

This should give you a screen coming up when you're finished.

    # Create a virtual environment to install the python dependencies
    virtualenv2 env

    # Activate the environment
    . env/bin/activate

    # Install the requirements
    pip install -r requirements.txt

    # You also need to install mlt, the mlt python bindings and VLC
    sudo apt install python-mlt vlc  # Debian and Ubuntu

    # And try the software (this will give you a white window if everything worked)
    python bin/integrated.py


Playing some video
------------------

Currently this is all a bit messy, but you can test out playing some video if
you like.  This is the guerilla way, the more correct one would be to create
your own schedule and fill up your disk with some files for this.

    # Create a folder for the video we will play
    mkdir -p repo/testmedia/media/1758/

    # Find any video file, and put it into that folder, give it the extension
    # ".avi" or ".mov" (small letters).
    mv MYFILE.MOV repo/testmedia/media/1758/myfile.mov

    # Create the folder for the ident (looping as long as there's nothing
    # on the schedule).  And copy another video file there.
    mkdir -p repo/ident/
    mv MYOTHERFILE.MOV repo/ident/FrikanalenLoop.avi

    # Now you can try running the test-version of the playout, and you should
    # hopefully see your first movie running once, then after that the looping
    # file will continue looping.
    PYTHONPATH=lib/:src/:. python src/vision/playout.py

Deploying in production
-----------------------

Quick and dirty deploy procedure:

    git clone https://github.com/Frikanalen/mltplayout.git fk-playout
    sudo addgroup fk-developer
    sudo adduser --system --ingroup fk-developer --no-create-home --shell /bin/nologin fk-playout
    sudo install -m 644 fk-playout/etc/fk-playout.service /etc/systemd/system/
    sudo install -m 644 fk-playout/etc/fk-update-jukebox.service /etc/systemd/system/
    sudo install -m 644 fk-playout/etc/fk-update-jukebox.timer   /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo mv fk-playout /opt/
    virtualenv -p python3 /opt/fk-playout/env
    . /opt/fk-playout/env/bin/activate
    pip install -r /opt/fk-playout/requirements.txt
    sudo chown -Rv fk-playout:fk-developer /opt/fk-playout
    sudo systemctl start fk-update-jukebox
    sudo systemctl start fk-playout
    sudo systemctl status fk-playout
