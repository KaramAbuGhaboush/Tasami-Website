# How to Get the Correct Connection Strings from Supabase

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Sign in and select your project: **vfdrngkjeldoysspfctj**

### 2. Get Connection Strings
1. Click **Settings** (gear icon) in the left sidebar
2. Click **Database** in the settings menu
3. Scroll down to the **Connection string** section

### 3. Copy the Connection Pooling String (for DATABASE_URL)
1. Click on the **Connection pooling** tab
2. Select **Transaction mode**
3. Copy the connection string - it should look like:
   ```
   postgresql://postgres.vfdrngkjeldoysspfctj:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
4. **Replace `[YOUR-PASSWORD]` with your actual database password** (L9HudeZHrNnZzyg3)
5. This goes in your `.env` file as `DATABASE_URL`

### 4. Copy the Direct Connection String (for DIRECT_URL)
1. Click on the **URI** tab (or **Connection string** tab)
2. Copy the connection string - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.vfdrngkjeldoysspfctj.supabase.co:5432/postgres
   ```
3. **Replace `[YOUR-PASSWORD]` with your actual database password** (L9HudeZHrNnZzyg3)
4. This goes in your `.env` file as `DIRECT_URL`

### 5. Verify Your Password
If you're not sure about your password:
1. In Supabase Dashboard → Settings → Database
2. Look for **Database password** section
3. If you don't remember it, click **Reset database password**
4. **Save the new password securely** - you'll need it for the connection strings

### 6. Update Your .env File
After copying the correct strings, update your `.env` file with:
- `DATABASE_URL` = Connection pooling string (with password filled in)
- `DIRECT_URL` = Direct connection string (with password filled in)

### 7. Test the Connection
Run:
```bash
npm run db:push
```

## Important Notes

- **Connection Pooling** (DATABASE_URL): Use for regular app operations
  - Username format: `postgres.vfdrngkjeldoysspfctj`
  - Port: `6543`
  - Host: `aws-1-ap-south-1.pooler.supabase.com`

- **Direct Connection** (DIRECT_URL): Use for migrations and schema changes
  - Username: `postgres`
  - Port: `5432`
  - Host: `db.vfdrngkjeldoysspfctj.supabase.co`

## Troubleshooting

If you still get authentication errors:
1. Double-check the password is correct
2. Make sure there are no extra spaces in the connection strings
3. Verify the password in Supabase dashboard matches what you're using
4. Try resetting the database password in Supabase and use the new one

