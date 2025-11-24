# Quick Setup Guide

## ⚠️ Important: Fix Your DATABASE_URL

The URL you added (`https://vfdrngkjeldoysspfctj.supabase.co`) is your Supabase project URL, **NOT** the database connection string.

## Step 1: Get the Correct Database Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (vfdrngkjeldoysspfctj)
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string** section
5. Select **Connection pooling** tab
6. Choose **Transaction mode**
7. Copy the connection string (it should look like this):
   ```
   postgresql://postgres.vfdrngkjeldoysspfctj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   **OR** use the **URI** format from the "URI" tab:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.vfdrngkjeldoysspfctj.supabase.co:5432/postgres
   ```

## Step 2: Create `.env.local` File

Create a `.env.local` file in the root of your project with the following:

```env
# Database Configuration (REQUIRED)
# Replace [YOUR-PASSWORD] with your actual Supabase database password
# Replace [REGION] with your Supabase region (e.g., us-east-1, eu-west-1)
DATABASE_URL="postgresql://postgres.vfdrngkjeldoysspfctj:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for migrations (OPTIONAL but recommended)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.vfdrngkjeldoysspfctj.supabase.co:5432/postgres"

# Authentication (REQUIRED)
# Generate a secure random string for JWT signing
# You can use: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-random"

# Application Configuration (OPTIONAL for local dev)
NEXT_PUBLIC_PRODUCTION_DOMAIN="localhost:3000"

# Email Configuration (OPTIONAL - only if you want contact form emails)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
# SMTP_SECURE="false"
```

## Step 3: Generate Prisma Client and Push Schema

After creating your `.env.local` file with the correct `DATABASE_URL`, run:

```bash
# Generate Prisma client
npm run db:generate

# Push the database schema to Supabase (creates all tables)
npm run db:push
```

## Step 4: Start the Development Server

```bash
npm run dev
```

Your application should now be running at http://localhost:3000

## Troubleshooting

### Error: "Can't reach database server"
- Make sure your `DATABASE_URL` is correct
- Verify your Supabase project is active
- Check that you've replaced `[YOUR-PASSWORD]` and `[REGION]` with actual values

### Error: "JWT_SECRET is not configured"
- Make sure you've added `JWT_SECRET` to your `.env.local` file
- Generate a secure random string: `openssl rand -base64 32`

### Error: "Prisma Client not generated"
- Run `npm run db:generate` first
- Make sure `DATABASE_URL` is set correctly

## Quick Reference

Your Supabase project reference: `vfdrngkjeldoysspfctj`

To find your region:
1. Go to Supabase Dashboard → Settings → General
2. Look for "Region" field

To reset your database password:
1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset database password"
3. Save the new password securely

