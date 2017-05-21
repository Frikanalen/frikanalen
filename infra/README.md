Frikanalen infrastructure
=========================

To deploy, run:

    ansible-playbook -i hosts -K --ask-vault-pass site.yml

Only deploying one of the projects, choose from:

    ansible-playbook -i hosts -K --ask-vault-pass site.yml -l web
    ansible-playbook -i hosts -K --ask-vault-pass site.yml -l upload
