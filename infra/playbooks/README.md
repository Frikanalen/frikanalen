In this directory is Ansible to manage Helm and Kubernetes deployments.


## Requirements

```bash
ansible-galaxy install -r requirements.yml
pip3 install -r requirements.txt
# -- or -- 
sudo apt install python3-kubernetes python3-openshift
```


## Vault

We store our keys in an encrypted vault. To create your own, do this:

```bash
ansible-vault encrypt default-secrets.yml --output vault.yml
```

## Grafana dashboards

Grafana dashboards are read from configmaps with the `grafana_dashboard` label.

Example:
```bash
wget https://grafana.com/api/dashboards/12586/revisions/1/download -O zfs_configmap.json
# Workaround for https://github.com/grafana/grafana/issues/10786
sed -i 's/${DS_PROMETHEUS}/Prometheus/g'
kubectl -n monitoring create configmap grafana-dashboards --from-file=zfs_configmap.json
kubectl -n monitoring label cm grafana-dashboards grafana_dashboard="1"
```


## Usage

```bash
ansible-playbook site.yml
```
