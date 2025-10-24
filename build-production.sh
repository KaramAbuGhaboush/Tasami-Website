#!/bin/bash

# Production Build Script for Tasami Website
echo "🚀 Building Tasami Website for Production..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install --production

# Step 2: Build frontend with production config
print_status "Building frontend for production (skipping linting)..."
cp next.config.production.ts next.config.ts
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed!"
    exit 1
fi

# Step 3: Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install --production

# Step 4: Build backend
print_status "Building backend for production..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Backend build failed!"
    exit 1
fi

# Step 5: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Step 6: Create deployment package
print_status "Creating deployment package..."
cd ..
tar -czf tasami-production-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=backend/node_modules \
    --exclude=backend/dist \
    --exclude=*.log \
    --exclude=.env* \
    --exclude=src/__tests__ \
    --exclude=test-* \
    .

print_status "Production build completed successfully! 🎉"
print_warning "Deployment package created: tasami-production-*.tar.gz"
print_warning "Ready for upload to your hosting provider!"
