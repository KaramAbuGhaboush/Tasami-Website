# Tasami Website Deployment on Injazat Hosting

## Overview
This guide covers deploying the Tasami website (Next.js frontend + Node.js backend) on Injazat hosting, a popular hosting provider in the Middle East.

## Injazat Hosting Requirements

### Minimum Package Requirements
- **Business Plan** or higher (Node.js support required)
- **Storage**: 5GB minimum (10GB recommended)
- **RAM**: 2GB minimum (4GB recommended)
- **Database**: MySQL 8.0+ (included)
- **SSL Certificate**: Free Let's Encrypt (included)
- **Node.js Version**: 18.x or higher

### Recommended Injazat Packages
- **Business Plan**: $15-25/month - Good for small to medium websites
- **Professional Plan**: $30-50/month - Better performance and resources
- **Enterprise Plan**: $50+/month - High-traffic websites

## Step-by-Step Deployment

### 1. Prepare Your Application

#### Build the Frontend
```bash
# Navigate to project root
cd /Users/karam/Documents/GitHub/Tasami-Website

# Run production build
./build-production.sh
```

This will create a `tasami-production-*.tar.gz` file ready for upload.

### 2. Access Injazat cPanel

#### Login to Injazat Control Panel
1. Go to your Injazat hosting control panel
2. Login with your credentials
3. Navigate to **File Manager** or **cPanel**

#### Enable Node.js Support
1. In cPanel, look for **"Node.js"** or **"Node.js Selector"**
2. Select Node.js version **18.x** or higher
3. Enable Node.js for your domain

### 3. Database Setup

#### Create MySQL Database
1. **Go to MySQL Databases** in cPanel
2. **Create Database**: `tasami_production`
3. **Create User**: `tasami_user`
4. **Set Password**: Use a strong password
5. **Assign User to Database** with full privileges

#### Note Database Details
- **Database Name**: `yourusername_tasami_production`
- **Username**: `yourusername_tasami_user`
- **Password**: `your_strong_password`
- **Host**: `localhost` (usually)

### 4. Upload Files

#### Upload via File Manager
1. **Navigate to public_html** in File Manager
2. **Upload** the `tasami-production-*.tar.gz` file
3. **Extract** the archive
4. **Delete** the tar.gz file after extraction

#### File Structure on Injazat
```
public_html/
├── .next/                    # Next.js build files
├── public/                   # Static assets
├── src/                      # Source files
├── package.json
├── next.config.js
├── .htaccess
├── backend/                  # Node.js backend
│   ├── dist/
│   ├── prisma/
│   ├── uploads/
│   ├── package.json
│   ├── ecosystem.config.js
│   └── .env
└── index.html
```

### 5. Configure Environment Variables

#### Frontend Environment (.env.local)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### Backend Environment (.env)
```env
NODE_ENV=production
PORT=3002
DATABASE_URL="mysql://yourusername_tasami_user:your_password@localhost:3306/yourusername_tasami_production"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="https://yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
```

### 6. Install Dependencies

#### Via cPanel Terminal (if available)
```bash
# Install frontend dependencies
cd public_html
npm install --production

# Install backend dependencies
cd backend
npm install --production
```

#### Via SSH (if available)
```bash
# Connect via SSH
ssh username@yourdomain.com

# Install dependencies
cd public_html
npm install --production
cd backend
npm install --production
```

### 7. Database Migration

#### Run Prisma Commands
```bash
# In backend directory
cd public_html/backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

### 8. Configure Node.js Application

#### Create Application File (public_html/app.js)
```javascript
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
```

#### Create package.json (public_html/package.json)
```json
{
  "name": "tasami-website",
  "version": "1.0.0",
  "description": "Tasami Website",
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
```

### 9. Configure Injazat Node.js

#### In cPanel Node.js Selector
1. **Select Node.js Version**: 18.x or higher
2. **Application Root**: `/public_html`
3. **Application URL**: `https://yourdomain.com`
4. **Application Startup File**: `app.js`
5. **Click "Create Application"**

### 10. Configure Web Server

#### Update .htaccess (public_html/.htaccess)
```apache
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
```

### 11. Test Your Deployment

#### Check Backend API
```bash
# Test API health
curl https://yourdomain.com/api/test

# Test specific endpoints
curl https://yourdomain.com/api/projects
curl https://yourdomain.com/api/blog/articles
```

#### Check Frontend
1. Visit `https://yourdomain.com`
2. Test all pages and functionality
3. Check browser console for errors
4. Test image uploads and API calls

### 12. Injazat-Specific Optimizations

#### Enable Caching
1. **In cPanel**, go to **"Caching"** or **"LiteSpeed Cache"**
2. **Enable** caching for better performance
3. **Configure** cache rules for static assets

#### Configure Email (if needed)
1. **In cPanel**, go to **"Email Accounts"**
2. **Create** email accounts for your domain
3. **Configure** SMTP settings in your backend

#### SSL Certificate
1. **In cPanel**, go to **"SSL/TLS"**
2. **Enable** "Force HTTPS Redirect"
3. **Install** Let's Encrypt certificate (free)

### 13. Monitoring and Maintenance

#### Check Application Logs
1. **In cPanel**, go to **"Error Logs"**
2. **Monitor** application errors
3. **Check** Node.js application logs

#### Database Management
1. **In cPanel**, go to **"phpMyAdmin"**
2. **Manage** your MySQL database
3. **Create** regular backups

#### Performance Monitoring
1. **In cPanel**, go to **"Metrics"** or **"Statistics"**
2. **Monitor** bandwidth usage
3. **Check** server resources

## Troubleshooting

### Common Issues

#### 1. Node.js Not Starting
- Check Node.js version in cPanel
- Verify application startup file
- Check environment variables
- Review application logs

#### 2. Database Connection Issues
- Verify database credentials
- Check database exists
- Ensure user has proper permissions
- Test connection with simple query

#### 3. File Permission Issues
```bash
# Set correct permissions
chmod 755 public_html
chmod 644 public_html/.env
chmod 755 public_html/backend
```

#### 4. API Not Working
- Check if backend is running
- Verify API endpoints
- Check CORS configuration
- Review network requests in browser

#### 5. Images Not Loading
- Check uploads directory permissions
- Verify image paths
- Check .htaccess configuration
- Ensure proper file permissions

### Injazat Support

#### Contact Support
- **Phone**: Check your hosting package for support number
- **Email**: support@injazat.com
- **Live Chat**: Available in cPanel
- **Ticket System**: Submit support tickets

#### Documentation
- **Injazat Knowledge Base**: Check their website
- **cPanel Documentation**: Standard cPanel guides
- **Node.js Guides**: Injazat-specific Node.js setup

## Cost Estimation

### Injazat Hosting Costs (Monthly)
- **Business Plan**: $15-25/month
- **Professional Plan**: $30-50/month
- **Enterprise Plan**: $50+/month

### Additional Costs
- **Domain Name**: $10-15/year (if not included)
- **SSL Certificate**: Free (Let's Encrypt)
- **Email Accounts**: Usually included
- **Database**: Included in hosting

### Total Monthly Cost
- **Basic Setup**: $15-25/month
- **Recommended Setup**: $30-50/month

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL certificate
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup database regularly
- [ ] Use strong JWT secrets
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Keep dependencies updated

## Performance Tips

### 1. Enable Caching
- Use Injazat's built-in caching
- Configure browser caching
- Implement application-level caching

### 2. Optimize Images
- Compress images before upload
- Use WebP format where possible
- Implement lazy loading

### 3. Database Optimization
- Regular database maintenance
- Optimize queries
- Use proper indexing

### 4. CDN (Optional)
- Consider using a CDN for static assets
- CloudFlare integration (if available)
- Image optimization services

This deployment guide is specifically tailored for Injazat hosting and should help you successfully deploy your Tasami website! 🚀
