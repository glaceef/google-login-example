#!/bin/sh

set -e

aws --profile home s3 sync ./dist/ s3://google-login-example-frontend

aws cloudfront create-invalidation \
    --profile home \
    --distribution-id E36V110KWXLTUG \
    --paths "/*" | cat
