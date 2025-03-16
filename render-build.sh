#!/usr/bin/env bash
# exit on error
set -o errexit

#Install dependencies
npm install

# Uncomment this line if you need to build your project
# npm run build

# Ensure the Puppeteer cache directory exist
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
PROJECT_CACHE_DIR=/opt/render/shdaowFitDesarrollo/src/.cache/puppeteer/chrome
mkdir -p $PUPPETEER_CACHE_DIR
mkdir -p $PROJECT_CACHE_DIR

# Install Puppeteer and download Chrome
npx puppeteer browsers install chrome

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PROJECT_CACHE_DIR ]]; then
    echo "...Copying Puppeteer Cache from Build Cache"
    # Copying Puppeteer browser files to your project's cache directory
    cp -R $PUPPETEER_CACHE_DIR/chrome/* $PROJECT_CACHE_DIR
else
    echo "...Storing Puppeteer Cache in Build Cache"
    cp -R $PROJECT_CACHE_DIR/* $PUPPETEER_CACHE_DIR
fi