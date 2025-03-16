#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Define directories
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
PROJECT_CACHE_DIR=/opt/render/project/src/src/.cache/puppeteer/chrome

npx puppeteer browsers install chrome

# Ensure directories exist
if [[ ! -d $PROJECT_CACHE_DIR ]]; then
    echo "La ruta no existe, creando el directorio..."
    mkdir -p $PROJECT_CACHE_DIR
else
    echo "El directorio ya existe: $PROJECT_CACHE_DIR"
fi
mkdir -p $PUPPETEER_CACHE_DIR

# Install Puppeteer and download Chrome
echo "Instalando Puppeteer y descargando Chrome..."
npx puppeteer browsers install chrome

# Store/pull Puppeteer cache with build cache
if [[ -d $PROJECT_CACHE_DIR ]]; then
    echo "...Storing Puppeteer Cache in Build Cache"
    cp -R $PROJECT_CACHE_DIR/* $PUPPETEER_CACHE_DIR
else
    echo "...Copying Puppeteer Cache from Build Cache"
    cp -R $PUPPETEER_CACHE_DIR/chrome/* $PROJECT_CACHE_DIR
fi
