export AWS_ACCESS_KEY_ID=$(kubectl -n beta get secret media -o jsonpath="{['data']['AWS_ACCESS_KEY_ID']}" | base64 --decode)
export AWS_SECRET_ACCESS_KEY=$(kubectl -n beta get secret media -o jsonpath="{['data']['AWS_SECRET_ACCESS_KEY']}" | base64 --decode)

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
    ],
    "Resource": [
      "arn:aws:s3:::media",
      "arn:aws:s3:::media/*"
    ]
  }]
}
EOF
)

echo $POLICY | s3cmd setpolicy /dev/stdin s3://media
