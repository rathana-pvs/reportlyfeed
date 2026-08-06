#!/bin/bash
# setup-vps.sh — Initial server setup for ReportlyFeed
set -e

echo "⚙️ Initializing ReportlyFeed VPS environment..."

# 1. Update Packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw

# 2. Install Docker & Docker Compose if missing
if ! command -v docker &> /dev/null; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
fi

# 3. Enable UFW Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "✅ VPS Setup complete! Please configure .env and run deploy.sh"
