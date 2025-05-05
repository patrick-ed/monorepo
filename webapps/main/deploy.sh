#!/bin/bash
set -e

USER=$1
PORT=$2
HOST=$3

APP_NAME="main"
LOCAL_DIR="webapps/$APP_NAME"
REMOTE_DIR="/home/$USER/monorepo/webapps/$APP_NAME"

# Upload project files to Raspberry Pi
echo "Uploading project files to Raspberry Pi..."
scp -P "$PORT" -r "$LOCAL_DIR" "pi-deploy:/home/$USER/monorepo/webapps/"

# Running deployment on Raspberry Pi
echo "Running deployment on Raspberry Pi..."
ssh -p "$PORT" pi-deploy <<EOF
  set -e

  echo "Navigating to project directory..."
  cd "$REMOTE_DIR"

  echo "Building Docker images..."
  docker compose build

  echo "Pulling down containers..."
  docker compose down || true

  echo "Starting containers..."
  docker compose up -d --build

  echo "Cleaning up unused images..."
  docker image prune -f

  echo "Deployment complete"
EOF