# utils/ingest/copy-to-legacy

This script is responsible for waiting for Kafka notifications on the
new-uploaded-video topic. It will then copy the uploaded file to file01,
essentially emulating the legacy upload service.

### Config

It expects a config/ folder, containing a file named "s3_endpoint_url" with the
adress to the RADOS GW.

An example Kubernets CRD for the config directory follows:
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: upload-processors
  namespace: default
data:
  s3_endpoint_url: |
    http://192.168.3.36:8085
```

### Secrets

It expects a secrets folder, with the AWS key ID and secret key which will
grant GetObject and ListBucket on the bucket "incoming", and an SSH private key
which will grant login as fkupload on file01.

An example Kubernetes CRD for the secrets directory follows:

```
apiVersion: v1
kind: Secret
metadata:
  name: upload-processors
  namespace: default
data:
  AWS_ACCESS_KEY_ID: ...
  AWS_SECRET_ACCESS_KEY: ...
  ssh_private_key: ...
type: Opaque
```

The S3 policies are enacted as follows:

```
s3cmd -v setpolicy s3_policies.json s3://incoming
```
