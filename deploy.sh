#!/bin/bash
# deploy.sh — Production zero-downtime deployment script for ReportlyFeed (reportlyfeed.com)
set -e

echo "🚀 Deploying ReportlyFeed..."

# Pull latest code
git pull origin main

# Build the new image
echo "🔨 Building Docker image..."
docker compose -f docker-compose.prod.yml build app

# Restart app container with zero-downtime
echo "♻️  Restarting app container..."
docker compose -f docker-compose.prod.yml up -d --no-deps app

# Remove dangling images
docker image prune -f

# Warm the cache
echo "🔥 Warming cache..."
sleep 5
curl -s -o /dev/null https://reportlyfeed.com/ || true

echo "✅ Deployment complete!"
