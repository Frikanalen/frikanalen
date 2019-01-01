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
