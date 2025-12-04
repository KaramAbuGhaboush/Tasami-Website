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


```
Tasami-Website
├─ .cursor
│  └─ commands
│     └─ en.md
├─ .htaccess
├─ components.json
├─ DEPLOYMENT.md
├─ eslint.config.mjs
├─ GET_CONNECTION_STRINGS.md
├─ middleware.ts
├─ next.config.production.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ prisma
│  ├─ schema.prisma
│  └─ seed
│     ├─ seed-blog-articles.ts
│     ├─ seed-blog-categories.ts
│     ├─ seed-categories.ts
│     ├─ seed-job-positions.ts
│     ├─ seed-testimonials.ts
│     └─ seed.ts
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
│  │  ├─ Mvp.json
│  │  └─ technology.json
│  ├─ next.svg
│  ├─ Service.png
│  ├─ SERVICES
│  │  ├─ AI.png
│  │  ├─ automation.png
│  │  ├─ marketing.png
│  │  ├─ quality assuurance.png
│  │  ├─ support.png
│  │  └─ ui ux.png
│  ├─ uploads
│  │  └─ images
│  │     ├─ ai-business.jpg
│  │     ├─ automation.jpg
│  │     ├─ blog-1761169139935-987005233.jpg
│  │     ├─ blog-1761175809687-585532344.png
│  │     ├─ blog-1761330088014-927718302.jpg
│  │     ├─ blog-1761334517026-637957566.jpg
│  │     ├─ blog-1761334590365-787994890.jpg
│  │     ├─ blog-1761335029322-523342903.jpg
│  │     ├─ blog-1761335206725-856540857.jpg
│  │     ├─ blog-1761335328805-948574623.jpg
│  │     ├─ blog-1762274338145-747602469.jpeg
│  │     ├─ blog-1762275150502-513036041.jpeg
│  │     ├─ blog-1762275706800-645284966.jpeg
│  │     ├─ blog-1763664004352-850976354.png
│  │     ├─ blog-1763665152946-835915516.png
│  │     ├─ blog-1763666007731-854440354.png
│  │     ├─ blog-1763666015485-444750258.png
│  │     ├─ blog-1763666022891-273831090.webp
│  │     ├─ blog-1763666031883-897728295.png
│  │     ├─ blog-1763666054820-769930234.png
│  │     ├─ blog-1763666061917-83019116.png
│  │     ├─ blog-1763667975671-143622414.png
│  │     ├─ blog-1763668453473-499737783.png
│  │     ├─ blog-1763668463504-438861050.png
│  │     ├─ blog-1763668578526-242663891.png
│  │     ├─ blog-1763668584957-393162903.webp
│  │     ├─ blog-1763668593480-989675991.png
│  │     ├─ blog-1763668603170-484988376.png
│  │     ├─ blog-1763669181929-577484479.webp
│  │     ├─ data-analysis.jpg
│  │     ├─ design-ui.jpg
│  │     ├─ marketing.jpg
│  │     └─ mvp.jpg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ scripts
├─ Service.png
├─ SETUP_GUIDE.md
├─ src
│  ├─ app
│  │  ├─ 404
│  │  │  └─ page.tsx
│  │  ├─ admin
│  │  │  ├─ blog
│  │  │  │  └─ page.tsx
│  │  │  ├─ career
│  │  │  │  └─ page.tsx
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ portfolio
│  │  │  │  └─ page.tsx
│  │  │  ├─ projects
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  └─ users
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ logout
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ me
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ register
│  │  │  │     └─ route.ts
│  │  │  ├─ blog
│  │  │  │  ├─ articles
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  ├─ [id]
│  │  │  │  │  └─ [slug]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ authors
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ categories
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  └─ upload-image
│  │  │  │     └─ route.ts
│  │  │  ├─ career
│  │  │  │  ├─ applications
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ jobs
│  │  │  │     ├─ route.ts
│  │  │  │     └─ [id]
│  │  │  │        └─ route.ts
│  │  │  ├─ categories
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ contact
│  │  │  │  └─ messages
│  │  │  │     ├─ route.ts
│  │  │  │     └─ [id]
│  │  │  │        └─ route.ts
│  │  │  ├─ employees
│  │  │  │  ├─ analytics
│  │  │  │  │  ├─ project-distribution
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ team-summary
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ stats
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     ├─ route.ts
│  │  │  │     ├─ time-entries
│  │  │  │     │  └─ route.ts
│  │  │  │     └─ weekly-summary
│  │  │  │        └─ route.ts
│  │  │  ├─ projects
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     ├─ content-blocks
│  │  │  │     │  ├─ reorder
│  │  │  │     │  │  └─ route.ts
│  │  │  │     │  ├─ route.ts
│  │  │  │     │  └─ [blockId]
│  │  │  │     │     └─ route.ts
│  │  │  │     └─ route.ts
│  │  │  ├─ testimonials
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  └─ time-entries
│  │  │     ├─ profile
│  │  │     │  ├─ route.ts
│  │  │     │  └─ weekly-goal
│  │  │     │     └─ route.ts
│  │  │     ├─ route.ts
│  │  │     ├─ weekly-summary
│  │  │     │  └─ route.ts
│  │  │     └─ [id]
│  │  │        └─ route.ts
│  │  ├─ employee
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ global-error.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  └─ [locale]
│  │     ├─ about
│  │     │  └─ page.tsx
│  │     ├─ article
│  │     │  └─ [slug]
│  │     │     └─ page.tsx
│  │     ├─ blog
│  │     │  ├─ layout.tsx
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
│  │  ├─ AboutClient.tsx
│  │  ├─ admin
│  │  │  ├─ BlogPage.tsx
│  │  │  ├─ CareerPage.tsx
│  │  │  ├─ CareerPageForm.tsx
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
│  │  ├─ ErrorBoundary.tsx
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
│  │  │  ├─ skeleton.tsx
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
│  │  ├─ about-data.ts
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  ├─ cache.ts
│  │  ├─ config.ts
│  │  ├─ errors.ts
│  │  ├─ home-data.ts
│  │  ├─ logger.ts
│  │  ├─ prisma.ts
│  │  ├─ rate-limit.ts
│  │  ├─ services-data.ts
│  │  ├─ structured-data.ts
│  │  ├─ upload.ts
│  │  ├─ utils.ts
│  │  └─ validation.ts
│  ├─ messages
│  │  ├─ ar.json
│  │  └─ en.json
│  ├─ middleware
│  │  └─ auth.ts
│  ├─ server
│  │  ├─ services
│  │  │  └─ emailService.ts
│  │  └─ utils
│  │     ├─ localization.ts
│  │     └─ performance.ts
│  ├─ services
│  │  ├─ blogService.ts
│  │  ├─ careerService.ts
│  │  ├─ contactService.ts
│  │  └─ projectService.ts
│  └─ utils
├─ TROUBLESHOOTING_DIRECT_CONNECTION.md
└─ tsconfig.json

```