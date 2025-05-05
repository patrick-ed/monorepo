#!/bin/bash
set -e

USER=$1
PORT=$2
HOST=$3

APP_NAME="main"
LOCAL_DIR="webapps/$APP_NAME"
REMOTE_DIR="/home/$USER/monorepo/webapps/$APP_NAME"

# Build images
echo "Building Docker images..."
docker buildx build \
  --platform linux/arm64 \
  --cache-from=type=local,src=.buildx-cache \
  --cache-to=type=local,dest=.buildx-cache \
  --output type=docker \
  -t main-frontend:latest \
  "$LOCAL_DIR/frontend"


# Save images to tarballs
echo "Saving images to tarballs..."
docker save main-frontend:latest | gzip > main-frontend.tar.gz

# Upload images and project files to Raspberry Pi
echo "Uploading images and project files to Raspberry Pi..."
scp -P "$PORT" main-frontend.tar.gz "pi-deploy:/home/$USER/temp/"
scp -P "$PORT" -r "$LOCAL_DIR" "pi-deploy:/home/$USER/monorepo/webapps/"

rm main-frontend.tar.gz

# Running deployment on Raspberry Pi
echo "Running deployment on Raspberry Pi..."
ssh -p "$PORT" pi-deploy <<EOF
  set -e

  echo "Loading Docker images..."
  gunzip -c /home/$USER/temp/main-frontend.tar.gz | docker load
  rm /home/$USER/temp/main-frontend.tar.gz

  echo "Navigating to project directory..."
  cd "$REMOTE_DIR"

  echo "Pulling down containers..."
  docker compose down || true

  echo "Starting containers..."
  docker compose up -d

  echo "Deployment complete"
EOF
