#!/bin/bash

npm run build
aws s3 cp build/ s3://static.thingler.io/ --recursive --exclude 'index.html' --cache-control 'max-age=86400'
aws s3 cp build/index.html s3://static.thingler.io/ --cache-control 'max-age=600'
