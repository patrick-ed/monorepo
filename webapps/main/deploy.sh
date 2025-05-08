#!/bin/bash
set -e

USER=$1
PORT=$2
HOST=$3

APP_NAME="main"
LOCAL_DIR="webapps/$APP_NAME"
REMOTE_DIR="/home/$USER/monorepo/webapps/$APP_NAME"

# Remove old files on server
ssh -p "$PORT" "pi-deploy" <<EOF
  set -e
  echo "[server] Removing old deployment directory..."
  rm -rf "$REMOTE_DIR" || true
  mkdir -p "$REMOTE_DIR"
EOF

# Upload project files to Raspberry Pi
echo "Uploading project files to Raspberry Pi..."
scp -P "$PORT" -r "$LOCAL_DIR" "pi-deploy:/home/$USER/monorepo/webapps/"

# Running deployment on Raspberry Pi
echo "Running deployment on Raspberry Pi..."
ssh -p "$PORT" pi-deploy <<EOF
  set -e

  echo "[server] Navigating to project directory..."
  cd "$REMOTE_DIR"

  echo "[server] Building Docker images..."
  docker compose build

  echo "[server] Pulling down containers..."
  docker compose down || true

  echo "[server] Starting containers..."
  docker compose up -d --build

  echo "[server] Cleaning up unused images..."
  docker image prune -f

  echo "[server] Deployment complete!"
EOF