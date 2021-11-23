# Frikanalen infrastructure

With some exceptions, Frikanalen runs in a Kubernetes on-premise installation. The remaining bare-metal services are being migrated away from. Developers are granted admin access to this cluster on an individual case-by-case basis.

## Servers

Frikanalen currently runs the following servers:

### obe-hd

Hardware: HP ProLiant DL360 G7, 2 x 8-core Xeon E5620, 8GiB RAM
SDI: DeckLink Mini Recorder 4K

Software: Debian 9.6 Stretch, OBE

This server encodes the MPEG-TS that is sent to our distributors, using fk-obe.service. This is best left alone. A full file system backup exists on simula.

### fw1

Hardware: Some 1U server

Software: FreeBSD

Our firewall. Relevant configs live in /etc/rc.local and /etc/pf.conf.

This made more sense back when we weren't using the Kubernetes ingress controller. Now it's probably redundant and facing decommissioning.

### simula

Hardware: HP ProLiant DL380 G5, 2 x 4-core Xeon E5440, 8 GiB RAM

Software: Debian GNU/Linux 11 (bullseye)

Simula is the Kubernetes master node, SSH bastion, and general development system for Frikanalen.

### tx1

Hardware: Intel S5520UR, 2 x 12-core Xeon X5675, 76 GB RAM
Disk: 2x500GB (root) 3 x 8TB (ceph-rook) 
SDI: Blackmagic Design Decklink SDI 4K
Software: Debian GNU/Linux 11 (bullseye)

tx1 is a Kubernetes worker node. Additionally, it runs fk-multiviewer-stream.service, an ffmpeg instance which receives AUX 2 from the vision mixer, which is generally set to input 10, which is a loop-back of the video mixer's multiviewer out.

### tx2

Hardware: Intel S5520UR, 2 x 12-core Xeon X5670, 70 GB RAM
Disk: 2x500GB (root) 2 x 8TB (ceph-rook) 
SDI: DeckLink HD Extreme 3
Software: Debian GNU/Linux 11 (bullseye)

tx2 is a Kubernetes worker node. Additionally, it is the host of an experimental attempt to run CasparCG as a docker instance.

### tx3

Hardware: Intel S5520UR, 2 x 12-core Xeon X5670, 96 GB RAM
Disk: 2x500GB (root) 2 x 8TB (ceph-rook) 
SDI: DeckLink Duo 2
Software: Debian GNU/Linux 11 (bullseye)

tx3 is **not** a Kubernetes node. Its only job is to run CasparCG.

### tx4

Hardware: Intel S5520UR, 2 x 12-core Xeon X5675, 78 GB RAM
Disk: 1x500GB (root) 2 x 8TB (ceph-rook) 
SDI: DeckLink SDI 4K
Software: Debian GNU/Linux 11 (bullseye)

tx4 is a Kubernetes node.

### file01

Hardware: Supermicro X11SSM-F, 8-core Xeon E3-1230 v5, 32 GB RAM
Software: Debian GNU/Linux 10 (buster), smbd

file01 is the legacy file server. It exposes the ZFS tank as an SMB share.

## Developer environment

To get a developer instance of the Frikanalen software stack, run deploy.sh in k8s-dev. This will semi-reliably generate a basic working environment for a developer.

## Ansible

Ansible is used to configure the hosts and services which are not Kubernetes-based.

To deploy, run:

    ansible-playbook -i hosts -K --ask-vault-pass site.yml

Only deploying one of the projects, choose from:

    ansible-playbook -i hosts -K --ask-vault-pass site.yml -l web
    ansible-playbook -i hosts -K --ask-vault-pass site.yml -l upload

If you only want to deploy the githook to frikanalen-dev (should be quite common when testing it):

    ansible-playbook -i hosts -K --ask-vault-pass site.yml -l frikanalen-dev.nuug.no -t githook

Changing vault:

    ansible-vault view --ask-vault-pass  group_vars/all/vault.yml
    ansible-vault edit --ask-vault-pass  group_vars/all/vault.yml

## Operations notes

### switch wiring
```
obe-HD:     eth0: sw1,9  eth2: sw1,25 eth3: sw2,25 ilo: sw1,33
tx1:        eth0: sw1,6  eth1: sw2,6 ilo: sw1,35
fw1:        eth0: sw1,1  eth1: internett ilo: sw1,17
kiloview:   eth0: sw1,16
tx3:        eth0: sw1,4  eth1: sw2,4 ilo: sw1,37
tx2:        eth0: sw1,7  eth1: sw2,7 ilo: sw1,36
simula:     eth0: sw2,5  eth1: sw1,5 ilo: sw1,18
tx4:        eth0: sw1,11 eth1: sw2,11 ilo: sw1,34
```
