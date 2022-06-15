## Secrets

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
  ssh_private_key: ...
type: Opaque
```
