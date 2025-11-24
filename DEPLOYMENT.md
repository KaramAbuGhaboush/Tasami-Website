# Deployment Guide: Vercel + Supabase

This guide covers deploying the Tasami website to Vercel with Supabase PostgreSQL database.

## Prerequisites

- Supabase account and project (https://supabase.com)
- Vercel account (https://vercel.com)
- GitHub repository connected to both services

## Environment Variables

### Required Environment Variables

Create a `.env.local` file for local development and configure the same variables in Vercel dashboard.

#### Database Configuration (Supabase PostgreSQL)

Get these from your Supabase project: **Settings → Database**

1. **DATABASE_URL** - Connection Pooling (Transaction mode)
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

2. **DIRECT_URL** - Direct Connection (for migrations)
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

   Replace:
   - `[PROJECT-REF]` with your Supabase project reference (e.g., `faipmyeddfhtxxsicjsq`)
   - `[YOUR-PASSWORD]` with your Supabase database password
   - `[REGION]` with your Supabase region (e.g., `us-east-1`)

#### Authentication

- **JWT_SECRET** - A secure random string for JWT token signing
  - Generate with: `openssl rand -base64 32`
  - Or use any secure random string generator

#### Application Configuration

- **NEXT_PUBLIC_PRODUCTION_DOMAIN** - Your production domain
  - Example: `tasami.co` or `your-app.vercel.app`
  
- **NEXT_PUBLIC_API_URL** (Optional) - API base URL
  - Defaults to your domain if not set
  - Example: `https://tasami.co/api`

#### Email Configuration (for contact form)

- **SMTP_HOST** - SMTP server hostname
  - Example: `smtp.gmail.com` or `mail.tasami.co`
  
- **SMTP_PORT** - SMTP port (usually 587)
  
- **SMTP_USER** - SMTP username/email
  
- **SMTP_PASS** - SMTP password
  
- **SMTP_SECURE** - Use secure connection (`true` or `false`)
  - `true` for port 465, `false` for other ports

#### File Uploads (Optional)

- **UPLOAD_DIR** - Directory for file uploads
  - Defaults to `./public/uploads/images` if not set

#### Server Configuration (Optional)

- **PORT** - Server port (defaults to 3000)

## Setup Steps

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Note your project URL and reference
3. Go to **Settings → Database** and copy connection strings
4. Save your database password securely

### 2. Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file with all required environment variables (see above)

4. Generate Prisma client and push schema to Supabase:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### 3. Vercel Deployment

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (already includes `prisma generate`)
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Root Directory: Leave as default

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all environment variables from the list above
   - Set for Production, Preview, and Development environments
   - Use Vercel's encryption for sensitive values

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Monitor build logs for any errors

### 4. Post-Deployment

1. **Verify Database Connection**
   - Check that your application can connect to Supabase
   - Test API routes that use the database

2. **Run Database Migrations** (if needed)
   - If you have migration files, they'll run automatically during build
   - Or manually: `npx prisma migrate deploy` in Vercel's deployment logs

3. **Test Functionality**
   - Test authentication endpoints
   - Test API routes
   - Test file uploads (if applicable)
   - Verify environment variables are set correctly

## Database Migration from SQLite to PostgreSQL

The Prisma schema has been updated to use PostgreSQL. To migrate existing data:

1. Export data from SQLite (if you have existing data)
2. Update your `.env.local` with Supabase connection strings
3. Run `npm run db:push` to create tables in Supabase
4. Import your data (if needed)

## Troubleshooting

### Build Errors

- **Prisma Client not generated**: Ensure `prisma generate` runs before build (already in build script)
- **Database connection errors**: Verify `DATABASE_URL` is correct in Vercel environment variables
- **Migration errors**: Check that `DIRECT_URL` is set for migrations

### Runtime Errors

- **JWT errors**: Verify `JWT_SECRET` is set in environment variables
- **Database connection**: Check Supabase project is active and connection strings are correct
- **SMTP errors**: Verify email configuration if using contact form

## Future Updates

### Deploying Updates

1. Make changes in a feature branch
2. Test locally with `.env.local`
3. Merge to `main` branch
4. Vercel will automatically deploy

### Database Schema Changes

1. Update `prisma/schema.prisma`
2. Create migration: `npm run db:migrate`
3. Commit migration files
4. Push to main - migrations run automatically during build

## Support

For issues or questions:
- Check Vercel deployment logs
- Check Supabase dashboard for database status
- Verify all environment variables are set correctly

