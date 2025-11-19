# Tasami API Documentation

## Overview
This backend API provides comprehensive endpoints for the Tasami website, including blog management, job positions, contact messages, projects, testimonials, user authentication, employee management, and time tracking.

## Interactive Documentation
The API documentation is available through Swagger UI at:
**http://localhost:3002/api-docs** (or your configured API_BASE_URL/api-docs)

## Base URL
```
http://localhost:3002/api
```
**Note**: Configure using `BACKEND_URL` or `API_BASE_URL` environment variables in production.

## Server Information
- **Port**: 3002 (configurable via PORT environment variable)
- **Health Check**: `http://localhost:3002/health` (or your configured BACKEND_URL/health)
- **API Test**: `http://localhost:3002/api/test` (or your configured API_BASE_URL/api/test)

**Note**: In production, configure these URLs using environment variables:
- `BACKEND_URL` - Base URL for the backend server
- `API_BASE_URL` - Full API base URL (if different from BACKEND_URL)

## Database Schema Overview

### 🔗 **Complete Database Schema**

The database uses **SQLite** with **Prisma ORM** and contains **16 interconnected models**:

#### **Authentication & User Management**
- **`User`** - User accounts and authentication
  - Fields: `id`, `email`, `name`, `password`, `role`, `isActive`, `weeklyGoal`, `department`, `phone`, `createdAt`, `updatedAt`
  - Relationships: One-to-Many with `TimeEntry`

#### **Blog System**
- **`BlogAuthor`** - Blog content authors
  - Fields: `id`, `name`, `role`, `email`, `avatar`, `bio`, `socialLinks`, `expertise`, `joinDate`, `createdAt`, `updatedAt`
  - Relationships: One-to-Many with `BlogArticle`

- **`BlogCategory`** - Blog article categories  
  - Fields: `id`, `name`, `slug`, `description`, `color`, `icon`, `seoTitle`, `seoDescription`, `featured`, `createdAt`, `updatedAt`
  - Relationships: One-to-Many with `BlogArticle`

- **`BlogArticle`** - Blog posts with full content management
  - Fields: `id`, `title`, `excerpt`, `content`, `slug`, `image`, `readTime`, `featured`, `status`, `views`, `tags`, `relatedArticles`, `createdAt`, `updatedAt`
  - Relationships: Many-to-One with `BlogAuthor` and `BlogCategory`

#### **Project Management System**
- **`ProjectCategory`** - Project categorization
  - Fields: `id`, `name`, `slug`, `description`, `color`, `icon`, `featured`, `sortOrder`, `status`, `createdAt`, `updatedAt`
  - Relationships: One-to-Many with `Project`

- **`Project`** - Company projects with technologies and results
  - Fields: `id`, `title`, `description`, `headerImage`, `challenge`, `solution`, `timeline`, `teamSize`, `status`, `createdAt`, `updatedAt`
  - Relationships: Many-to-One with `ProjectCategory`, One-to-Many with `ProjectTechnology`, `ProjectResult`, `ProjectTestimonial`, `ContentBlock`

- **`ProjectTechnology`** - Technologies used in projects
  - Fields: `id`, `name`, `description`, `projectId`
  - Relationships: Many-to-One with `Project`

- **`ProjectResult`** - Project outcomes and metrics
  - Fields: `id`, `metric`, `description`, `projectId`
  - Relationships: Many-to-One with `Project`

- **`ProjectTestimonial`** - Client testimonials for projects
  - Fields: `id`, `quote`, `author`, `position`, `projectId`
  - Relationships: One-to-One with `Project`

- **`ContentBlock`** - Dynamic content blocks for projects
  - Fields: `id`, `type`, `order`, `content`, `src`, `alt`, `width`, `height`, `caption`, `level`, `columns`, `images`, `projectId`, `createdAt`, `updatedAt`
  - Relationships: Many-to-One with `Project`

#### **Career & HR System**
- **`Job`** - Career opportunities
  - Fields: `id`, `title`, `department`, `location`, `type`, `experience`, `description`, `requirements`, `benefits`, `status`, `postedDate`, `applicationDeadline`, `applications`, `salary`, `team`, `createdAt`, `updatedAt`
  - Relationships: None (standalone)

#### **Communication System**
- **`ContactMessage`** - Contact form submissions
  - Fields: `id`, `name`, `email`, `company`, `message`, `service`, `budget`, `status`, `source`, `createdAt`, `updatedAt`
  - Required: `name`, `email`, `message`, `service`, `budget`
  - Auto-generated: `source` (default: "website"), `status` (default: "new")
  - Relationships: None (standalone)

- **`Testimonial`** - Client testimonials
  - Fields: `id`, `name`, `role`, `company`, `quote`, `rating`, `initials`, `featured`, `status`, `createdAt`, `updatedAt`
  - Relationships: None (standalone)

#### **Internal HR System**
- **`Employee`** - Internal employee management
  - Fields: `id`, `name`, `position`, `email`, `department`, `salary`, `hireDate`, `status`, `benefits`, `createdAt`, `updatedAt`
  - Relationships: One-to-Many with `Salary`

- **`Salary`** - Employee salary tracking
  - Fields: `id`, `amount`, `frequency`, `lastPaid`, `nextPayment`, `status`, `deductions`, `netPay`, `employeeId`, `createdAt`, `updatedAt`
  - Relationships: Many-to-One with `Employee`

#### **Time Tracking System**
- **`TimeEntry`** - Employee time tracking entries
  - Fields: `id`, `date`, `hours`, `minutes`, `project`, `description`, `userId`, `createdAt`, `updatedAt`
  - Relationships: Many-to-One with `User`

### 📊 **Database Statistics**
- **Total Models**: 16
- **Total Relationships**: 9
- **Primary Keys**: All models use `cuid()` for unique IDs
- **Timestamps**: All models have `createdAt` and `updatedAt`
- **Soft Deletes**: Status-based filtering instead of hard deletes
- **JSON Fields**: Used for flexible data (tags, socialLinks, expertise, requirements, benefits, etc.)

### 📋 **Model List**
1. **User** - Authentication and user management with time tracking
2. **BlogAuthor** - Blog content authors
3. **BlogCategory** - Blog article categories
4. **BlogArticle** - Blog posts
5. **Project** - Company projects
6. **ProjectCategory** - Project categorization
7. **ProjectTechnology** - Technologies used in projects
8. **ProjectResult** - Project outcomes and metrics
9. **ProjectTestimonial** - Client testimonials for projects
10. **ContentBlock** - Dynamic content blocks for projects
11. **Job** - Career opportunities
12. **ContactMessage** - Contact form submissions
13. **Testimonial** - General marketing testimonials
14. **Employee** - Internal employee management
15. **Salary** - Employee salary tracking
16. **TimeEntry** - Employee time tracking entries

### 🔗 **Database Relationships Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BlogAuthor    │────│  BlogArticle    │────│  BlogCategory   │
│                 │    │                 │    │                 │
│ • id            │    │ • id            │    │ • id            │
│ • name          │    │ • title         │    │ • name          │
│ • email         │    │ • content       │    │ • slug          │
│ • avatar        │    │ • slug          │    │ • color         │
│ • bio           │    │ • featured      │    │ • featured      │
│ • socialLinks   │    │ • status        │    │ • seoTitle      │
│ • expertise     │    │ • views         │    │ • seoDescription│
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ProjectCategory  │────│    Project      │────│ProjectTechnology│
│                 │    │                 │    │                 │
│ • id            │    │ • id            │    │ • id            │
│ • name          │    │ • title         │    │ • name          │
│ • slug          │    │ • description   │    │ • description   │
│ • color         │    │ • headerImage   │    │ • projectId     │
│ • featured      │    │ • status        │    └─────────────────┘
│ • sortOrder     │    │ • challenge     │
│ • status        │    │ • solution      │    ┌─────────────────┐
└─────────────────┘    └─────────────────┘    │  ProjectResult  │
                                │             │                 │
                                │             │ • id            │
                                │             │ • metric        │
                                │             │ • description   │
                                │             │ • projectId     │
                                │             └─────────────────┘
                                │
                                │             ┌──────────────────┐
                                │             │ProjectTestimonial│
                                │             │                  │
                                │             │ • id             │
                                │             │ • quote          │
                                │             │ • author         │
                                │             │ • position       │
                                │             │ • projectId      │
                                │             └──────────────────┘
                                │
                                │             ┌─────────────────┐
                                │             │  ContentBlock   │
                                │             │                 │
                                │             │ • id            │
                                │             │ • type          │
                                │             │ • order         │
                                │             │ • content       │
                                │             │ • projectId     │
                                │             └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │────│   TimeEntry     │    │ ContactMessage  │
│                 │    │                 │    │                 │
│ • id            │    │ • id            │    │ • id            │
│ • email         │    │ • date          │    │ • name          │
│ • name          │    │ • hours         │    │ • email         │
│ • password      │    │ • minutes       │    │ • company       │
│ • role          │    │ • project       │    │ • message       │
│ • isActive      │    │ • description   │    │ • service       │
│ • weeklyGoal    │    │ • userId        │    │ • budget        │
│ • department    │    │ • createdAt     │    │ • status        │
│ • phone         │    │ • updatedAt     │    │ • source        │
│ • createdAt     │    └─────────────────┘    │ • createdAt     │
│ • updatedAt     │                           │ • updatedAt     │
└─────────────────┘                           └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Employee     │────│     Salary      │    │   Testimonial   │
│                 │    │                 │    │                 │
│ • id            │    │ • id            │    │ • id            │
│ • name          │    │ • amount        │    │ • name          │
│ • position      │    │ • frequency     │    │ • role          │
│ • email         │    │ • lastPaid      │    │ • company       │
│ • department    │    │ • nextPayment   │    │ • quote         │
│ • salary        │    │ • status        │    │ • rating        │
│ • hireDate      │    │ • deductions    │    │ • initials      │
│ • status        │    │ • netPay        │    │ • featured      │
│ • benefits      │    │ • employeeId    │    │ • status        │
│ • createdAt     │    │ • createdAt     │    │ • createdAt     │
│ • updatedAt     │    │ • updatedAt     │    │ • updatedAt     │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐
│      Job        │
│                 │
│ • id            │
│ • title         │
│ • department    │
│ • location      │
│ • type          │
│ • experience    │
│ • description   │
│ • requirements  │
│ • benefits      │
│ • status        │
│ • salary        │
│ • team          │
│ • postedDate    │
│ • applicationDeadline│
│ • applications  │
│ • createdAt     │
│ • updatedAt     │
└─────────────────┘
```

## Available Endpoints

### 🎉 **COMPLETE API DOCUMENTATION** (72 endpoints)

**📊 FINAL STATUS:**
- **Total endpoints in code**: 72 endpoints
- **Swagger documented**: 72 endpoints ✅ **100% COMPLETE!**
- **Missing from Swagger**: 0 endpoints ✅ **NONE!**

---

## ✅ **ALL ENDPOINTS DOCUMENTED IN SWAGGER** (72 total)

### Authentication (`/api/auth`) - 4 endpoints
- `POST /register` - Register a new user (no token returned - for admin-created users)
- `POST /login` - User login (returns JWT token)
- `GET /me` - Get current user profile (requires authentication)
- `PUT /me` - Update current user profile (requires authentication)

### Blog Management (`/api/blog`) - 14 endpoints
**Public Endpoints:**
- `GET /articles` - Get all blog articles (with pagination, filtering)
- `GET /articles/:slug` - Get article by slug (increments view count)
- `GET /categories` - Get all blog categories
- `GET /authors` - Get all blog authors

**Admin Endpoints:**
- `POST /articles` - Create new article
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `POST /authors` - Create author
- `PUT /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author
- `POST /upload-image` - Upload image for blog articles

### Career Management (`/api/career`) - 6 endpoints
**Public Endpoints:**
- `GET /jobs` - Get all job positions (with filtering)
- `GET /jobs/:id` - Get job by ID
- `POST /applications` - Submit job application

**Admin Endpoints:**
- `POST /jobs` - Create new job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

### Contact Management (`/api/contact`) - 5 endpoints
**Public Endpoints:**
- `POST /messages` - Submit contact message (requires: name, email, message, service, budget)

**Admin Endpoints:**
- `GET /messages` - Get all contact messages (Admin)
- `PUT /messages/:id` - Update message status
- `DELETE /messages/:id` - Delete message
- `GET /messages/stats` - Get contact message statistics

**📝 Contact Form Integration:**
- Form fields: `name`, `email`, `company`, `service`, `budget`, `message`
- API validation: `name`, `email`, `message`, `service`, `budget` are required
- Auto-generated: `status` (default: "new"), `source` (default: "website")

### Employee Time Tracking (`/api/time-entries`) - 7 endpoints
**Employee Endpoints:**
- `POST /` - Create new time entry (Employee only)
- `GET /` - Get user's time entries (with filters for today/week/all)
- `PUT /:id` - Update time entry (Employee only)
- `DELETE /:id` - Delete time entry (Employee only)
- `GET /weekly-summary` - Get weekly hours summary
- `GET /profile` - Get user profile with weekly goal
- `PUT /profile/weekly-goal` - Update weekly goal

### Employee Management (`/api/employees`) - 16 endpoints
**Admin Endpoints:**
- `GET /` - Get all employees (Admin only)
- `POST /` - Create new employee (Admin only)
- `GET /:id` - Get specific employee (Admin only)
- `PUT /:id` - Update employee (Admin only)
- `DELETE /:id` - Delete employee (Admin only)
- `GET /:id/time-entries` - Get employee's time entries (Admin)
- `GET /:id/weekly-summary` - Get employee's weekly summary (Admin)
- `GET /:id/salaries` - Get employee's salary history (Admin)
- `POST /:id/salaries` - Create salary record for employee (Admin)
- `PUT /:id/salaries/:salaryId` - Update salary record (Admin)
- `DELETE /:id/salaries/:salaryId` - Delete salary record (Admin)
- `GET /stats` - Get employee statistics (Admin)
- `GET /departments` - Get all departments (Admin)
- `GET /positions` - Get all positions (Admin)
- `POST /bulk-import` - Bulk import employees (Admin)
- `GET /export` - Export employee data (Admin)

### Project Management (`/api/projects`) - 10 endpoints
**Public Endpoints:**
- `GET /` - Get all projects (with category filtering)
- `GET /:id` - Get project by ID with content blocks

**Admin Endpoints:**
- `POST /` - Create new project (with technologies, results, and testimonial)
- `PUT /:id` - Update project (with technologies, results, and testimonial)
- `DELETE /:id` - Delete project

**Content Block Management:**
- `POST /:id/content-blocks` - Create new content block for project
- `PUT /:id/content-blocks/:blockId` - Update content block
- `DELETE /:id/content-blocks/:blockId` - Delete content block
- `PUT /:id/content-blocks/reorder` - Reorder content blocks

### Testimonial Management (`/api/testimonials`) - 5 endpoints
**Public Endpoints:**
- `GET /` - Get all testimonials (with featured filtering)
- `GET /:id` - Get testimonial by ID

**Admin Endpoints:**
- `POST /` - Create testimonial
- `PUT /:id` - Update testimonial
- `DELETE /:id` - Delete testimonial

### Category Management (`/api/categories`) - 5 endpoints
**Public Endpoints:**
- `GET /` - Get all project categories
- `GET /:id` - Get category by ID

**Admin Endpoints:**
- `POST /` - Create category
- `PUT /:id` - Update category
- `DELETE /:id` - Delete category

> **🎉 All 72 endpoints now have complete Swagger documentation with interactive testing!**

## Query Parameters

### Pagination
Most list endpoints support pagination:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

### Filtering
- **Blog Articles**: `category`, `featured`, `status`
- **Jobs**: `department`, `location`, `type`
- **Testimonials**: `featured`, `status`
- **Projects**: `category`
- **Time Entries**: `date`, `project`, `userId`
- **Employees**: `department`, `status`, `position`

## Response Format
All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Authentication
- JWT tokens are used for authentication
- Include token in Authorization header: `Bearer <token>`
- Token expires in 7 days
- Password hashing uses bcrypt with 12 salt rounds

## User Creation Flow
- **Admin creates users**: Use `/api/employees` endpoint (Admin only, no token returned)
- **Public registration**: Use `/api/auth/register` endpoint (no token returned, for admin-created users)
- **User login**: Use `/api/auth/login` endpoint (returns JWT token for authentication)

## Security Features
- **Helmet**: Security headers
- **CORS**: Configured for frontend domains
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Request body validation
- **SQL Injection Protection**: Prisma ORM
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication

## Database Features
- **SQLite**: Development database
- **Prisma ORM**: Type-safe database access
- **Migrations**: Database schema management
- **Relationships**: Foreign key relationships between models
- **Soft Deletes**: Status-based filtering instead of hard deletes
- **Indexing**: Optimized queries with proper indexes
- **JSON Support**: Flexible data structures for complex fields

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio
```

## Environment Variables
- `PORT`: Server port (default: 3002)
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: JWT signing secret
- `FRONTEND_URL`: Frontend URL for CORS
- `NODE_ENV`: Environment (development/production)

## API Status
- ✅ Authentication system
- ✅ Blog management (CRUD)
- ✅ Project management with content blocks
- ✅ Career management
- ✅ Contact management
- ✅ Testimonial management
- ✅ Category management
- ✅ Employee management with salary tracking
- ✅ Time tracking system
- ✅ Swagger documentation
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Error handling
- ✅ Input validation
- ✅ File upload support
- ✅ Bulk operations
- ✅ Data export functionality

## 📊 **Current API Summary**

### ✅ **Swagger Documented** (72 endpoints) - **100% COMPLETE!**
- **Authentication**: 4 endpoints ✅
- **Blog**: 14 endpoints ✅ (4 public + 10 admin)
- **Career**: 6 endpoints ✅ (3 public + 3 admin)  
- **Contact**: 5 endpoints ✅ (1 public + 4 admin)
- **Employee Time Tracking**: 7 endpoints ✅ (7 employee)
- **Employee Management**: 16 endpoints ✅ (16 admin)
- **Projects**: 10 endpoints ✅ (2 public + 8 admin)
- **Testimonials**: 5 endpoints ✅ (2 public + 3 admin)
- **Categories**: 5 endpoints ✅ (2 public + 3 admin)

### 📈 **Total API Coverage**
- **Total Endpoints in Code**: 72 endpoints
- **Swagger Documented**: 72 endpoints (100%) ✅ **ALL ENDPOINTS DOCUMENTED!**
- **Missing from Swagger**: 0 endpoints (0%)
- **Complete Swagger documentation coverage achieved!**

## 🔧 **Key Features**

### **Content Management**
- Dynamic blog system with authors, categories, and articles
- Project showcase with content blocks and testimonials
- Image upload and management
- SEO optimization with meta fields

### **Employee Management**
- Complete HR system with employee records
- Salary tracking and history
- Time tracking with weekly goals
- Department and position management
- Bulk import/export functionality

### **Communication**
- Contact form with service and budget tracking
- Client testimonial management
- Job application system
- Newsletter integration ready

### **Project Management**
- Project categorization and filtering
- Technology and result tracking
- Dynamic content blocks for case studies
- Client testimonial integration
- Image gallery support

### **Security & Performance**
- JWT-based authentication
- Role-based access control
- Rate limiting and CORS protection
- Input validation and sanitization
- Database query optimization
- Caching middleware

This API provides a complete backend solution for the Tasami website with full CRUD operations, authentication, file management, and comprehensive documentation.