# fk-obe

These are the systemd configuration files and a support script to enable us to
launch open broadcast encoder using systemd so the system can boot at load time.

## Installation

As root:
~~~~
apt-get install python3-pexpect
adduser --system --no-create-home --shell /bin/nologin fk-obe
install -m 644 fk-obe.service /etc/systemd/system
install -m 755 fk-obe /usr/local/bin
install -m 644 fk-obe.conf /etc
systemctl daemon-reload
~~~~

## Todo:

* Move more configuration parameters into fk-obe.conf; ideally supporting
preset roles which can be used by name and defined in the configuration
file

* Package this script as a Debian package for easier deployment

