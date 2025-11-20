# NextJS Fullstack App

A modern full-stack web application built with Next.js 14, TypeScript, Prisma, and SQLite. Features user authentication, post management, and a beautiful responsive UI.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Post Management**: Create, read, update, and delete posts
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application
- **Database**: SQLite database with Prisma ORM
- **Real-time Updates**: Dynamic UI updates without page refresh

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Tailwind CSS with responsive design

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
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate the database
npx prisma db push
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

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your production database URL
   - `JWT_SECRET`: A secure secret key for JWT signing
4. Deploy!

### Environment Variables

Create a `.env.local` file for production:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-super-secure-jwt-secret"
```

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

```
Tasami-Website
├─ .cursor
│  └─ commands
│     └─ en.md
├─ .htaccess
├─ backend
│  ├─ .htaccess
│  ├─ API_DOCUMENTATION.md
│  ├─ ecosystem.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ schema.prisma
│  │  ├─ seed-blog-articles.ts
│  │  ├─ seed-blog-categories.ts
│  │  ├─ seed-categories.ts
│  │  ├─ seed-job-positions.ts
│  │  ├─ seed-testimonials.ts
│  │  └─ seed.ts
│  ├─ src
│  │  ├─ config
│  │  │  ├─ constants.ts
│  │  │  ├─ security.ts
│  │  │  └─ swagger.ts
│  │  ├─ middleware
│  │  │  ├─ auth.ts
│  │  │  ├─ cache.ts
│  │  │  ├─ errorHandler.ts
│  │  │  ├─ security.ts
│  │  │  ├─ upload.ts
│  │  │  └─ validation.ts
│  │  ├─ routes
│  │  │  ├─ auth.ts
│  │  │  ├─ blog.ts
│  │  │  ├─ career.ts
│  │  │  ├─ categories.ts
│  │  │  ├─ contact.ts
│  │  │  ├─ employees.ts
│  │  │  ├─ projects.ts
│  │  │  ├─ testimonials.ts
│  │  │  └─ timeEntries.ts
│  │  ├─ server.ts
│  │  ├─ services
│  │  │  └─ emailService.ts
│  │  └─ utils
│  │     ├─ localization.ts
│  │     └─ performance.ts
│  ├─ tsconfig.json
│  └─ uploads
│     └─ images
│        ├─ ai-business.jpg
│        ├─ automation.jpg
│        ├─ blog-1761169139935-987005233.jpg
│        ├─ blog-1761175809687-585532344.png
│        ├─ blog-1761330088014-927718302.jpg
│        ├─ blog-1761334517026-637957566.jpg
│        ├─ blog-1761334590365-787994890.jpg
│        ├─ blog-1761335029322-523342903.jpg
│        ├─ blog-1761335206725-856540857.jpg
│        ├─ blog-1761335328805-948574623.jpg
│        ├─ blog-1762274338145-747602469.jpeg
│        ├─ blog-1762275150502-513036041.jpeg
│        ├─ blog-1762275706800-645284966.jpeg
│        ├─ data-analysis.jpg
│        ├─ design-ui.jpg
│        ├─ marketing.jpg
│        └─ mvp.jpg
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.production.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  └─ schema.prisma
├─ public
│  ├─ file.svg
│  ├─ Font
│  │  ├─ Hacen-Algeria-Bd.ttf
│  │  ├─ Hacen-Algeria.ttf
│  │  ├─ ROCK.TTF
│  │  └─ Rockwell-Bold.ttf
│  ├─ globe.svg
│  ├─ Logo.png
│  ├─ lotties
│  │  ├─ animations
│  │  │  └─ cc8e23a8-14cd-11ed-8c34-12dbed2149cd.json
│  │  ├─ artificial_intelligence.json
│  │  ├─ Automation_Process.json
│  │  ├─ Data_Analysis.json
│  │  ├─ Design_X_UI.json
│  │  ├─ ecommerce-automation.lottie
│  │  ├─ manifest.json
│  │  ├─ Marketing_Solutions.json
│  │  └─ Mvp.json
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ admin
│  │  │  ├─ blog
│  │  │  │  └─ page.tsx
│  │  │  ├─ career
│  │  │  │  └─ page.tsx
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ portfolio
│  │  │  │  └─ page.tsx
│  │  │  ├─ projects
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  └─ users
│  │  │     └─ page.tsx
│  │  ├─ employee
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ global-error.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ [locale]
│  │     ├─ about
│  │     │  └─ page.tsx
│  │     ├─ article
│  │     │  └─ [slug]
│  │     │     └─ page.tsx
│  │     ├─ blog
│  │     │  └─ page.tsx
│  │     ├─ career
│  │     │  └─ page.tsx
│  │     ├─ contact
│  │     │  └─ page.tsx
│  │     ├─ error.tsx
│  │     ├─ Font
│  │     │  ├─ ROCK.TTF
│  │     │  └─ Rockwell-Bold.ttf
│  │     ├─ layout.tsx
│  │     ├─ not-found.tsx
│  │     ├─ page.tsx
│  │     ├─ projects
│  │     │  └─ [id]
│  │     │     └─ page.tsx
│  │     ├─ services
│  │     │  └─ page.tsx
│  │     ├─ test-404
│  │     ├─ work
│  │     │  └─ page.tsx
│  │     ├─ [...not-found]
│  │     └─ [...slug]
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ About.tsx
│  │  ├─ admin
│  │  │  ├─ BlogPage.tsx
│  │  │  ├─ CareerPage.tsx
│  │  │  ├─ ContactPage.tsx
│  │  │  ├─ DashboardCharts.tsx
│  │  │  ├─ OverviewPage.tsx
│  │  │  ├─ PortfolioPage.tsx
│  │  │  └─ UsersPage.tsx
│  │  ├─ Admin.tsx
│  │  ├─ AdminLayout.tsx
│  │  ├─ AdminSidebar.tsx
│  │  ├─ AIHero.tsx
│  │  ├─ Article.tsx
│  │  ├─ Blog.tsx
│  │  ├─ Career.tsx
│  │  ├─ CategoryFilter.tsx
│  │  ├─ ConditionalNavbar.tsx
│  │  ├─ Contact.tsx
│  │  ├─ Employee.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Home.tsx
│  │  ├─ LightweightAnimation.tsx
│  │  ├─ LoadingSpinner.tsx
│  │  ├─ LottieAnimation.tsx
│  │  ├─ OptimizedImage.tsx
│  │  ├─ PerformanceToggle.tsx
│  │  ├─ Project.tsx
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectCaseStudy.tsx
│  │  ├─ ProjectEditor.tsx
│  │  ├─ ProtectedRoute.tsx
│  │  ├─ ScrollNavbar.tsx
│  │  ├─ Services.tsx
│  │  ├─ TestimonialsSlider.tsx
│  │  ├─ ui
│  │  │  ├─ alert-dialog.tsx
│  │  │  ├─ avatar.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ calendar.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ dropdown-menu.tsx
│  │  │  ├─ form.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ label.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ popover.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ textarea.tsx
│  │  │  └─ toast.tsx
│  │  └─ Work.tsx
│  ├─ contexts
│  │  └─ AuthContext.tsx
│  ├─ hooks
│  │  ├─ useAbout.ts
│  │  ├─ useAdmin.ts
│  │  ├─ useArticle.ts
│  │  ├─ useBlog.ts
│  │  ├─ useBlogAdmin.ts
│  │  ├─ useCareer.ts
│  │  ├─ useCareerAdmin.ts
│  │  ├─ useContact.ts
│  │  ├─ useContactAdmin.ts
│  │  ├─ useDashboardOverview.ts
│  │  ├─ useEmployee.ts
│  │  ├─ useHome.ts
│  │  ├─ useNotification.ts
│  │  ├─ usePortfolioAdmin.ts
│  │  ├─ useProject.ts
│  │  ├─ useProjects.ts
│  │  ├─ useServices.ts
│  │  ├─ useTestimonials.ts
│  │  ├─ useTestimonialsSlider.ts
│  │  ├─ useWork.ts
│  │  └─ useWorkData.ts
│  ├─ i18n
│  │  ├─ request.ts
│  │  └─ routing.ts
│  ├─ lib
│  │  ├─ api.ts
│  │  ├─ config.ts
│  │  └─ utils.ts
│  ├─ messages
│  │  ├─ ar.json
│  │  └─ en.json
│  ├─ middleware
│  │  └─ auth.ts
│  ├─ utils
│  └─ __tests__
│     ├─ portfolio-admin.test.tsx
│     └─ usePortfolioAdmin.test.ts
└─ tsconfig.json

```