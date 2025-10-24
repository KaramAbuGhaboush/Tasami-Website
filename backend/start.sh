#!/bin/bash

# Tasami Backend Startup Script
echo "🚀 Starting Tasami Backend Server..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the backend directory
if [ ! -f "package.json" ] || [ ! -f "ecosystem.config.js" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install --production

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Push database schema
print_status "Pushing database schema..."
npx prisma db push

# Start with PM2
print_status "Starting backend with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup

print_status "Backend server started successfully! 🎉"
print_warning "Backend is running on port 3002"
print_warning "API endpoints available at: http://localhost:3002/api"
