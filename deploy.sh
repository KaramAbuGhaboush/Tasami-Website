#!/bin/bash

# Tasami Website Deployment Script
echo "🚀 Starting Tasami Website Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Step 2: Build frontend
print_status "Building frontend for production..."
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
tar -czf tasami-deployment-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=backend/node_modules \
    --exclude=backend/dist \
    --exclude=*.log \
    --exclude=.env* \
    .

print_status "Deployment package created successfully!"
print_warning "Don't forget to:"
echo "1. Upload the tar.gz file to your server"
echo "2. Extract it in your public_html directory"
echo "3. Install dependencies on the server"
echo "4. Configure environment variables"
echo "5. Set up the database"
echo "6. Start the backend with PM2"

print_status "Deployment preparation complete! 🎉"
