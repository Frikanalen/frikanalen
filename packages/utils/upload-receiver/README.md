# Tusd Video Upload Processor

This project utilizes [tusd](https://github.com/tus/tusd) for handling robust file uploads via HTTP and copies them via SSH to our legacy file server.

## Overview

The application is dockerized and is supposed to run within a container environment. It's been configured to handle `pre-create` and `pre-finish` hooks by executing Python scripts to validate upload tokens and process the uploaded files, respectively.

### Pre-requisites

- Docker
- Python 3.x
- Access to an S3 bucket with appropriate permissions
- SSH access to a file server

## Configuration

### Docker

The provided Dockerfile sets up the environment needed for running tusd along with the necessary Python scripts. It includes the installation of Python3, pip, paramiko, and requests.

#### Environment Variables

- `FK_API`: The API endpoint for querying video upload tokens (defaults to 'http://django.default.svc.cluster.local/api').
- `FK_TOKEN`: A token required for the API authorization.

### Hooks

The `hooks` directory contains scripts that are executed at different stages of the upload process:

#### `pre-create`

This script is triggered when an upload is initiated. It performs the following actions:

1. Validates the presence of `FK_TOKEN`.
2. Parses the incoming request for metadata containing `uploadToken` and `videoID`.
3. Queries the `FK_API` to validate the `uploadToken` for the provided `videoID`.
4. Refuses the upload if the token is incorrect or if there's an issue with the request.

#### `pre-finish`

This script is executed once a file has been successfully uploaded. It performs the following actions:

1. Reads the status of the uploaded file, extracting the video ID, original filename, and storage path.
2. Establishes an SSH connection to the file server using the provided credentials.
3. Creates a temporary directory on the file server, copies the uploaded file from the S3 storage, and moves it to a `watchfolder` for further processing.
4. Cleans up the temporary file from the S3 storage.

### Secrets

The application expects a `secrets` folder, containing:

- AWS Key ID and Secret Key: These should grant `GetObject` and `ListBucket` permissions on the S3 bucket named "incoming".
- SSH Private Key: This key should allow logging in to the file server as the `fkupload` user.

#### Kubernetes Secret Configuration

If you're deploying on Kubernetes, you can manage these secrets using a Secret object. Here's an example definition:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: upload-processors
  namespace: default
data:
  ssh_private_key: ...
type: Opaque
```
