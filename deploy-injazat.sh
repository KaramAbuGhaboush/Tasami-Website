#!/bin/bash

# Injazat Hosting Deployment Script for Tasami Website
echo "🚀 Preparing Tasami Website for Injazat Hosting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
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
print_status "Building frontend for production..."
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

# Step 6: Create Injazat-specific app.js
print_status "Creating Injazat Node.js application file..."
cd ..

cat > app.js << 'EOF'
// Injazat Node.js Application Entry Point
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3002;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the backend server
const backendProcess = spawn('node', ['backend/dist/server.js'], {
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'production' }
});

backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the application
app.listen(PORT, () => {
  console.log(`Tasami application running on port ${PORT}`);
});
EOF

# Step 7: Create Injazat-specific package.json
print_status "Creating Injazat package.json..."
cat > package-injazat.json << 'EOF'
{
  "name": "tasami-website",
  "version": "1.0.0",
  "description": "Tasami Website - Injazat Deployment",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Step 8: Create Injazat-specific .htaccess
print_status "Creating Injazat .htaccess configuration..."
cat > .htaccess << 'EOF'
# Injazat-specific .htaccess Configuration
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^_next/(.*)$ /_next/$1 [L]

# API requests to Node.js backend
RewriteRule ^api/(.*)$ http://localhost:3002/api/$1 [P,L]

# Handle Next.js pages
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1 [L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Cache static assets
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
EOF

# Step 9: Create environment template
print_status "Creating Injazat environment template..."
cat > injazat-env-template.txt << 'EOF'
# Injazat Environment Variables Template
# Copy these to your .env files on Injazat hosting

# Frontend (.env.local)
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Backend (.env)
NODE_ENV=production
PORT=3002
DATABASE_URL="mysql://yourusername_tasami_user:your_password@localhost:3306/yourusername_tasami_production"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="https://yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
EOF

# Step 10: Create deployment package
print_status "Creating Injazat deployment package..."
tar -czf tasami-injazat-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next/cache \
    --exclude=backend/node_modules \
    --exclude=backend/dist \
    --exclude=*.log \
    --exclude=.env* \
    --exclude=src/__tests__ \
    --exclude=test-* \
    --exclude=deploy*.sh \
    --exclude=build*.sh \
    --exclude=*.md \
    .

print_status "Injazat deployment package created successfully! 🎉"
print_warning "Files created:"
echo "  📦 tasami-injazat-*.tar.gz - Upload this to Injazat"
echo "  📄 injazat-env-template.txt - Environment variables template"
echo "  📄 INJAZAT_DEPLOYMENT.md - Detailed deployment guide"

print_info "Next steps:"
echo "1. Upload tasami-injazat-*.tar.gz to your Injazat public_html directory"
echo "2. Extract the archive in public_html"
echo "3. Rename package-injazat.json to package.json"
echo "4. Configure environment variables using injazat-env-template.txt"
echo "5. Set up MySQL database in Injazat cPanel"
echo "6. Configure Node.js application in cPanel"
echo "7. Test your deployment!"

print_warning "Don't forget to:"
echo "  - Change all placeholder values in environment files"
echo "  - Set up your MySQL database"
echo "  - Configure Node.js in Injazat cPanel"
echo "  - Enable SSL certificate"
echo "  - Test all functionality"

print_status "Ready for Injazat deployment! 🚀"
