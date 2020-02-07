Frikanalen TV playout
=====================

[![Documentation Status](https://readthedocs.org/projects/mltplayout/badge/?version=latest)](https://mltplayout.readthedocs.io/en/latest/?badge=latest)

Trying it out
-------------

It's currently not that easy to try out. Hopefully it'll become easier to set
up in the future.  Right now we can give a few tips on how to proceed.

This should give you a screen coming up when you're finished.

    # Create a virtual environment to install the python dependencies
    virtualenv -p python3 env

    # Activate the environment
    . env/bin/activate

    # Install the requirements
    pip install -r requirements.txt

    # You also need to install VLC
    sudo apt install vlc  # Debian and Ubuntu

    # And try the software (this will give you a white window if everything worked)
    ./fk-playout-service


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
    ./fk-playout-service
