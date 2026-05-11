#!/bin/bash
set -e

echo "========================================="
echo "  LEGO Website - Deploy Script"
echo "========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Install with:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

echo "[1/6] Node.js version: $(node -v)"
echo "[2/6] Installing dependencies..."
npm install

echo "[3/6] Building frontend..."
npm run build

echo "[4/6] Creating required directories..."
mkdir -p public/data server/uploads/images server/uploads/videos server/uploads/files logs

echo "[5/6] Setting permissions..."
chmod -R 755 server/uploads public/data

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo "[INFO] PM2 not found, installing globally..."
    sudo npm install -g pm2
fi

echo "[6/6] Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "========================================="
echo "  Deploy complete!"
echo "  Site: http://localhost:3001"
echo "  Run 'pm2 logs' to view logs"
echo "  Run 'pm2 status' to check status"
echo "========================================="
