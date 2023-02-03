#!/bin/bash

npm run build
aws s3 cp build/ s3://static.thingler.io/ --recursive --cache-control 'max-age=2678400' \
    --exclude '*.html' \
    --exclude 'map.png' \
    --exclude '.DS_Store'
aws s3 cp build/map.png s3://static.thingler.io/ --cache-control 'max-age=600'
aws s3 cp build/*.html s3://static.thingler.io/ --cache-control 'max-age=600'
