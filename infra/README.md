Frikanalen infrastructure
=========================

Requires Ansible >=2.4

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

### Operations notes

#### switch wiring
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
