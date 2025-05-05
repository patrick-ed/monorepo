#!/bin/bash
set -e

USER=$1
PORT=$2
HOST=$3

APP_NAME="fullstackproject"
LOCAL_DIR="webapps/$APP_NAME"
REMOTE_DIR="/home/$USER/monorepo/webapps/$APP_NAME"

# Build images
echo "Building Docker images..."
docker build -t fsp-frontend:latest "$LOCAL_DIR/frontend"
docker build -t fsp-backend:latest "$LOCAL_DIR/backend"

# Save images to tarballs
echo "Saving images to tarballs..."
docker save fsp-frontend:latest | gzip > fsp-frontend.tar.gz
docker save fsp-backend:latest | gzip > fsp-backend.tar.gz

# Upload images and project files to Raspberry Pi
echo "Uploading images and project files to Raspberry Pi..."
scp -P "$PORT" fsp-frontend.tar.gz fsp-backend.tar.gz "pi-deploy:/home/$USER/temp/"
scp -P "$PORT" -r "$LOCAL_DIR" "pi-deploy:/home/$USER/monorepo/webapps/"

rm fsp-frontend.tar.gz fsp-backend.tar.gz

# Running deployment on Raspberry Pi
echo "Running deployment on Raspberry Pi..."
ssh -p "$PORT" "pi-deploy" <<EOF
  set -e

  echo "Loading Docker images..."
  gunzip -c /home/$USER/temp/fsp-frontend.tar.gz | docker load
  gunzip -c /home/$USER/temp/fsp-backend.tar.gz | docker load
  rm /home/$USER/temp/fsp-frontend.tar.gz /home/$USER/temp/fsp-backend.tar.gz

  echo "Navigating to project directory..."
  cd "$REMOTE_DIR"

  echo "Pulling down containers..."
  docker compose down || true

  echo "Starting containers..."
  docker compose up -d

  echo "Deployment complete"
EOF
