# Tasami Website

A modern full-stack web application built with Next.js 15, TypeScript, Prisma, and PostgreSQL (Supabase). Features user authentication, post management, and a beautiful responsive UI.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Post Management**: Create, read, update, and delete posts
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application
- **Database**: SQLite database with Prisma ORM
- **Real-time Updates**: Dynamic UI updates without page refresh

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Tailwind CSS with responsive design
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nextjs-fullstack-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database

1. Create a `.env.local` file with your environment variables (see [DEPLOYMENT.md](./DEPLOYMENT.md) for details)
2. Add your Supabase `DATABASE_URL` to `.env.local`
3. Generate Prisma client and push schema:
```bash
# Generate Prisma client
npm run db:generate

# Create and migrate the database
npm run db:push
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthModal.tsx
│   ├── CreatePostModal.tsx
│   └── PostCard.tsx
└── lib/
    ├── auth.ts
    └── db.ts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts/[id]` - Get a specific post
- `PUT /api/posts/[id]` - Update a post (requires authentication)
- `DELETE /api/posts/[id]` - Delete a post (requires authentication)

## 🗄️ Database Schema

The application uses the following database models:

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User's full name
- `password`: Hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Post
- `id`: Unique identifier
- `title`: Post title
- `content`: Post content
- `published`: Publication status
- `authorId`: Reference to the author
- `createdAt`: Post creation timestamp
- `updatedAt`: Last update timestamp

## 🔐 Authentication

The application uses JWT tokens for authentication. When a user logs in or registers, they receive a JWT token that must be included in the Authorization header for protected routes:

```
Authorization: Bearer <your-jwt-token>
```

## 🎨 UI Components

- **AuthModal**: Login and registration modal
- **CreatePostModal**: Modal for creating new posts
- **PostCard**: Display component for individual posts

## 🚀 Deployment

This application is configured for deployment on **Vercel** with **Supabase** PostgreSQL database.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Start

1. **Set up Supabase**
   - Create a Supabase project
   - Get your database connection strings from Supabase dashboard

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard (see [DEPLOYMENT.md](./DEPLOYMENT.md))
   - Deploy!

### Required Environment Variables

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a complete list of environment variables, including:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `NEXT_PUBLIC_PRODUCTION_DOMAIN` - Your production domain
- SMTP configuration (for contact form)
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
# Tasami-Website
# Tasami-Website
