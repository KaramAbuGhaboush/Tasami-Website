# Troubleshooting Direct Connection Issue

## Current Problem
Prisma can't reach the direct database connection at `db.vfdrngkjeldoysspfctj.supabase.co:5432`

## Possible Causes & Solutions

### 1. Database is Paused
**Check:**
- Go to Supabase Dashboard → Your Project
- Look for "Paused" status or "Restore" button
- If paused, click "Restore" and wait 1-2 minutes

### 2. Direct Connections Disabled
**Check:**
- Go to Supabase Dashboard → Settings → Database
- Look for "Connection Pooling" settings
- Ensure direct connections are enabled
- Some Supabase plans restrict direct connections

### 3. IP Restrictions
**Check:**
- Go to Supabase Dashboard → Settings → Database
- Look for "Connection Pooling" → "Allowed IPs"
- Make sure your IP is allowed, or set to "Allow all IPs"

### 4. Get Exact Connection String
**Do this:**
1. Go to Supabase Dashboard → Settings → Database
2. Scroll to "Connection string" section
3. Click on "URI" tab (NOT "Connection pooling")
4. Copy the exact connection string shown
5. It should look like:
   ```
   postgresql://postgres:[PASSWORD]@db.vfdrngkjeldoysspfctj.supabase.co:5432/postgres
   ```
6. Update your `.env` file `DIRECT_URL` with this exact string

### 5. Alternative: Use Supabase SQL Editor
If direct connections don't work, you can manually create tables:
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL commands to create your tables
3. Then use the pooler connection for your app

### 6. Test Connection Manually
You can test if the direct connection works using `psql`:
```bash
psql "postgresql://postgres:ebo0Cf41NPVLzGqr@db.vfdrngkjeldoysspfctj.supabase.co:5432/postgres"
```

If this works, the issue is with Prisma configuration.
If this doesn't work, the issue is with Supabase settings or network.

## Quick Fix to Try

Temporarily remove `directUrl` from `prisma/schema.prisma` and see if pooler works (not recommended for production):

1. Edit `prisma/schema.prisma`
2. Remove the `directUrl = env("DIRECT_URL")` line
3. Set `DATABASE_URL` to use pooler
4. Try `npm run db:push`

**Note:** This may not work as `prisma db push` typically requires direct connections.

## Recommended Solution

1. **Verify database is active** in Supabase dashboard
2. **Get the exact DIRECT_URL** from Supabase Settings → Database → Connection string → URI tab
3. **Update your `.env` file** with the exact connection string
4. **Try the connection again**

