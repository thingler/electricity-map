#!/bin/bash

npm run build

# Upload all non-HTML assets with long cache
aws s3 cp build/ s3://static.thingler.io/ --recursive --cache-control 'max-age=2678400' \
    --exclude '*.html' \
    --exclude 'map.jpg' \
    --exclude 'sitemap*.xml' \
    --exclude '.DS_Store'

# Upload map.jpg with short cache (10 min)
aws s3 cp build/map.jpg s3://static.thingler.io/ --cache-control 'max-age=600'

# Upload sitemaps with 1 day cache
aws s3 cp build/ s3://static.thingler.io/ --recursive --cache-control 'max-age=86400' \
    --exclude '*' \
    --include 'sitemap*.xml'

# Upload all HTML files with short cache (10 min)
aws s3 cp build/ s3://static.thingler.io/ --recursive --cache-control 'max-age=600' \
    --exclude '*' \
    --include '*.html'
