# 🚀 Project Setup Guide

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- MySQL database server running

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the template and update with your actual values:

```bash
# Copy the template (if you haven't already)
# Then edit .env file with your actual credentials
```

**Required `.env` variables:**

```env
# Database (REQUIRED - Update with your MySQL credentials)
DATABASE_URL="mysql://username:password@localhost:3306/tasami_db"

# JWT Secret (REQUIRED - Change to a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key-change-this-in-production"

# Email Configuration (REQUIRED for contact form)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional but recommended
NODE_ENV="development"
UPLOAD_DIR="./public/uploads/images"
NEXT_PUBLIC_PRODUCTION_DOMAIN="www.tasami.co"
```

**Important:**

- Replace `username`, `password`, and `tasami_db` in `DATABASE_URL` with your actual MySQL credentials
- Make sure your MySQL server is running
- Create the database if it doesn't exist: `CREATE DATABASE tasami_db;`

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

### 4. Push Database Schema

```bash
npm run db:push
```

This creates/updates all tables in your MySQL database according to the Prisma schema.

### 5. Seed the Database (Optional)

```bash
# Seed all data
npm run db:seed

# Or seed individual tables
npm run db:seed:testimonials
npm run db:seed:categories
npm run db:seed:blog-categories
npm run db:seed:blog-articles
npm run db:seed:jobs
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Frontend:** http://localhost:3000
- **API Routes:** http://localhost:3000/api/\*

---

## Quick Start (All Commands)

```bash
# 1. Install dependencies
npm install

# 2. Update .env file with your credentials (manually)

# 3. Generate Prisma Client
npm run db:generate

# 4. Push database schema
npm run db:push

# 5. Seed database (optional)
npm run db:seed

# 6. Start development server
npm run dev
```

---

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Troubleshooting

### Database Connection Issues

- Make sure MySQL server is running
- Verify `DATABASE_URL` format: `mysql://user:pass@host:port/dbname`
- Check database exists: `SHOW DATABASES;`
- Verify user has permissions: `GRANT ALL ON tasami_db.* TO 'user'@'localhost';`

### Prisma Issues

- If schema changes, run: `npm run db:generate` then `npm run db:push`
- To reset database: `npx prisma migrate reset` (⚠️ deletes all data)

### Port Already in Use

- Change port: `PORT=3001 npm run dev`
- Or kill process using port 3000

### Email Not Working

- For Gmail: Use App Password (not regular password)
- Enable "Less secure app access" or use App Passwords
- Check SMTP settings match your email provider

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

---

## Project Structure

```
Tasami-Website/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed/                  # Seed files
├── src/
│   ├── app/
│   │   ├── api/               # API routes (Next.js Route Handlers)
│   │   └── [locale]/          # Frontend pages
│   ├── lib/                   # Utilities (auth, validation, etc.)
│   └── server/                # Server-side services
├── public/                    # Static files
└── .env                       # Environment variables
```

---

## Next Steps After Setup

1. ✅ Verify database connection works
2. ✅ Test API endpoints at `/api/*`
3. ✅ Test authentication (login/register)
4. ✅ Test file uploads
5. ✅ Configure email service for contact form
6. ✅ Deploy to Vercel (when ready)

---

## Need Help?

- Check `ENV_TEMPLATE.txt` for all environment variables
- Review `README.md` for project overview
- Check Prisma docs: https://www.prisma.io/docs
