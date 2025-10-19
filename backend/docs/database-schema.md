# Database Schema Documentation

## Overview
This document describes the database schema for the Tasami Website backend, focusing on blog and articles functionality. The database uses SQLite with Prisma ORM.

## Database Configuration
- **Provider**: SQLite
- **ORM**: Prisma
- **Connection**: Environment variable `DATABASE_URL`

## Blog and Articles Schema

### BlogAuthor Model
Represents blog authors who write articles.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Author's full name | Required |
| `role` | String | Author's role/title | Required |
| `email` | String | Author's email address | Required, unique |
| `avatar` | String? | Avatar image URL | Optional |
| `bio` | String? | Author's biography | Optional |
| `socialLinks` | Json? | Social media links | Optional JSON object |
| `expertise` | Json | Areas of expertise | Required JSON array |
| `joinDate` | DateTime | Date author joined | Auto-generated |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- One-to-many with `BlogArticle` (author can have multiple articles)

### BlogCategory Model
Represents categories for organizing blog articles.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Category name | Required, unique |
| `slug` | String | URL-friendly identifier | Required, unique |
| `description` | String? | Category description | Optional |
| `color` | String? | Category color (hex code) | Optional |
| `icon` | String? | Category icon | Optional |
| `seoTitle` | String? | SEO title | Optional |
| `seoDescription` | String? | SEO description | Optional |
| `featured` | Boolean | Whether category is featured | Default: false |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Relationships:**
- One-to-many with `BlogArticle` (category can have multiple articles)

### BlogArticle Model
Represents individual blog articles.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `title` | String | Article title | Required |
| `excerpt` | String? | Article excerpt/summary | Optional |
| `content` | String? | Full article content | Optional |
| `slug` | String | URL-friendly identifier | Required, unique |
| `image` | String? | Featured image URL | Optional |
| `readTime` | String? | Estimated reading time | Optional |
| `featured` | Boolean | Whether article is featured | Default: false |
| `status` | String | Article status | Default: "draft", options: "draft", "published", "archived" |
| `views` | Int | View count | Default: 0 |
| `tags` | Json | Article tags | Required JSON array |
| `relatedArticles` | Json | Related articles | Required JSON array |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |
| `authorId` | String | Foreign key to BlogAuthor | Required |
| `categoryId` | String | Foreign key to BlogCategory | Required |

**Relationships:**
- Many-to-one with `BlogAuthor` (article belongs to one author)
- Many-to-one with `BlogCategory` (article belongs to one category)

## Database Relationships

```
BlogAuthor (1) ←→ (N) BlogArticle (N) ←→ (1) BlogCategory
```

- **BlogAuthor** can have multiple **BlogArticle**s
- **BlogCategory** can have multiple **BlogArticle**s
- **BlogArticle** belongs to exactly one **BlogAuthor** and one **BlogCategory**

## Data Types and Constraints

### JSON Fields
- `socialLinks`: Object containing social media URLs
- `expertise`: Array of expertise areas
- `tags`: Array of article tags
- `relatedArticles`: Array of related article IDs

### Status Values
- **Article Status**: "draft", "published", "archived"
- **Author Role**: Custom string (e.g., "Author", "Editor", "Contributor")

### Auto-generated Fields
- **CUID**: Collision-resistant unique identifier
- **Timestamps**: Automatic creation and update tracking

## Indexes and Performance
- Primary keys are automatically indexed
- Unique constraints on `email`, `slug` fields
- Foreign key relationships are indexed for performance

## Data Validation Rules
1. **Required Fields**: All models have required fields that cannot be null
2. **Unique Constraints**: Email addresses and slugs must be unique
3. **Cascade Deletes**: Deleting an author or category will cascade delete related articles
4. **Default Values**: Sensible defaults for optional fields

## Company Information Schema

### CompanyInfo Model
Represents company information for hero section, culture, and other content.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `type` | String | Content type | Required, options: "hero", "culture", "stats", "values" |
| `title` | String? | Content title | Optional |
| `content` | String | Main content text | Required |
| `data` | Json | Flexible data structure | Required JSON object for stats, culture points, etc. |
| `featured` | Boolean | Whether content is featured | Default: false |
| `order` | Int | Display order | Default: 0 |
| `status` | String | Content status | Default: "active" |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Usage Examples:**
- **Hero content**: `type: "hero"`, `title: "Build the Future With Us"`, `content: "Join a team of innovators..."`
- **Culture content**: `type: "culture"`, `title: "Our Culture"`, `content: "At TechFlow, we believe..."`
- **Company stats**: `type: "stats"`, `data: { "teamMembers": "50+", "countries": "15+", "retention": "95%", "satisfaction": "4.8/5" }`

### CompanyStat Model
Represents individual company statistics and metrics.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `label` | String | Stat label | Required |
| `value` | String | Stat value | Required |
| `description` | String? | Stat description | Optional |
| `icon` | String? | Stat icon | Optional |
| `color` | String? | Stat color (hex code) | Optional |
| `featured` | Boolean | Whether stat is featured | Default: false |
| `order` | Int | Display order | Default: 0 |
| `status` | String | Stat status | Default: "active" |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Usage Examples:**
- Team Members: `label: "Team Members"`, `value: "50+"`, `color: "#6812F7"`
- Countries: `label: "Countries"`, `value: "15+"`, `color: "#9253F0"`
- Retention Rate: `label: "Retention Rate"`, `value: "95%"`, `color: "#6812F7"`
- Satisfaction: `label: "Satisfaction"`, `value: "4.8/5"`, `color: "#9253F0"`

## Contact Form Schema

### ContactMessage Model
Represents contact form submissions from the website.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Contact person's name | Required |
| `email` | String | Contact person's email | Required |
| `phone` | String? | Contact person's phone | Optional |
| `company` | String? | Contact person's company | Optional |
| `subject` | String | Message subject | Required |
| `message` | String | Message content | Required |
| `service` | String? | Requested service type | Optional |
| `budget` | String? | Project budget range | Optional |
| `timeline` | String? | Project timeline | Optional |
| `status` | String | Message status | Default: "new", options: "new", "read", "replied", "closed" |
| `priority` | String | Message priority | Default: "medium", options: "low", "medium", "high" |
| `source` | String? | Message source | Optional, options: "website", "email", "phone" |
| `assignedTo` | String? | Assigned team member | Optional |
| `notes` | String? | Internal notes | Optional |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"new"**: Newly submitted message (default)
- **"read"**: Message has been read by admin
- **"replied"**: Response has been sent to contact
- **"closed"**: Message/conversation is closed

**Priority Values:**
- **"low"**: Low priority message
- **"medium"**: Normal priority message (default)
- **"high"**: High priority message requiring immediate attention

**Source Values:**
- **"website"**: Submitted through website contact form
- **"email"**: Received via email
- **"phone"**: Received via phone call

## Testimonial Schema

### Testimonial Model
Represents client testimonials and reviews.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Client's name | Required |
| `role` | String? | Client's role/title | Optional |
| `company` | String? | Client's company | Optional |
| `quote` | String | Testimonial content | Required |
| `rating` | Int | Star rating (1-5) | Default: 5, range: 1-5 |
| `initials` | String? | Client's initials for avatar | Optional |
| `featured` | Boolean | Whether testimonial is featured | Default: false |
| `status` | String | Testimonial status | Default: "active", options: "active", "inactive" |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"active"**: Testimonial is visible and published (default)
- **"inactive"**: Testimonial is hidden or archived

**Rating Values:**
- **1-5**: Star rating scale (1 = poor, 5 = excellent)
- **Default: 5**: New testimonials default to 5 stars

**Usage Examples:**
- **Work page testimonials**: Featured testimonials for carousel display
- **Project page testimonials**: Client testimonials for specific projects
- **General testimonials**: Company-wide testimonials and reviews

## Project Schema

### Project Model
Represents portfolio projects and case studies.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `title` | String | Project title | Required |
| `description` | String | Project description | Required |
| `headerImage` | String? | Project header image URL | Optional |
| `challenge` | String? | Project challenge description | Optional |
| `solution` | String? | Project solution description | Optional |
| `timeline` | String? | Project timeline | Optional |
| `teamSize` | String? | Team size for project | Optional |
| `status` | String | Project status | Default: "planning", options: "planning", "active", "completed", "archived" |
| `featured` | Boolean | Whether project is featured | Default: false |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"planning"**: Project is in planning phase (default)
- **"active"**: Project is currently in development
- **"completed"**: Project is finished and delivered
- **"archived"**: Project is archived and hidden

**Relationships:**
- Many-to-one with `ProjectCategory` (project belongs to one category)
- One-to-many with `ProjectTechnology` (project can have multiple technologies)
- One-to-many with `ProjectResult` (project can have multiple results)
- One-to-one with `ProjectTestimonial` (project can have one client testimonial)

### ProjectTechnology Model
Represents technologies used in projects.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Technology name | Required |
| `description` | String | Technology description | Required |
| `projectId` | String | Associated project ID | Required, foreign key |

**Relationships:**
- Many-to-one with `Project` (technology belongs to one project)

### ProjectResult Model
Represents project results and metrics.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `metric` | String | Result metric (e.g., "40%", "3x") | Required |
| `description` | String | Result description | Required |
| `projectId` | String | Associated project ID | Required, foreign key |

**Relationships:**
- Many-to-one with `Project` (result belongs to one project)

### ProjectTestimonial Model
Represents client testimonials for specific projects.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `quote` | String | Testimonial quote | Required |
| `author` | String | Client's name | Required |
| `position` | String | Client's position/title | Required |
| `projectId` | String | Associated project ID | Required, unique foreign key |

**Relationships:**
- One-to-one with `Project` (testimonial belongs to one project)

### ProjectCategory Model
Represents project categories for organization.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Category name | Required, unique |
| `slug` | String | URL-friendly identifier | Required, unique |
| `description` | String? | Category description | Optional |
| `color` | String? | Category color (hex code) | Optional |
| `icon` | String? | Category icon | Optional |
| `featured` | Boolean | Whether category is featured | Default: false |
| `sortOrder` | Int | Display order | Default: 0 |
| `status` | String | Category status | Default: "active", options: "active", "inactive" |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"active"**: Category is visible and available (default)
- **"inactive"**: Category is hidden or archived

**Relationships:**
- One-to-many with `Project` (category can have multiple projects)

**Usage Examples:**
- **Work page projects**: Featured projects with categories, technologies, and results
- **Project detail pages**: Full project information with client testimonials
- **Category filtering**: Filter projects by category on work page
- **Project showcase**: Display project portfolio with detailed information

## User Schema

### User Model
Represents system users including admins and employees.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `email` | String | User's email address | Required, unique |
| `name` | String? | User's full name | Optional |
| `password` | String | Hashed password | Required |
| `role` | String | User role | Default: "user", options: "admin", "employee", "user" |
| `avatar` | String? | User's avatar image URL | Optional |
| `phone` | String? | User's phone number | Optional |
| `department` | String? | User's department | Optional |
| `position` | String? | User's job position | Optional |
| `status` | String | User status | Default: "active", options: "active", "inactive", "suspended" |
| `lastLogin` | DateTime? | Last login timestamp | Optional |
| `emailVerified` | Boolean | Email verification status | Default: false |
| `twoFactorEnabled` | Boolean | Two-factor authentication status | Default: false |
| `preferences` | Json? | User preferences | Optional JSON object |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Role Values:**
- **"admin"**: System administrator with full access
- **"employee"**: Company employee with limited access
- **"user"**: Regular user (default)

**Status Values:**
- **"active"**: User is active and can log in (default)
- **"inactive"**: User account is disabled
- **"suspended"**: User account is temporarily suspended

**Relationships:**
- One-to-many with `TimeEntry` (user can have multiple time entries)
- One-to-one with `Employee` (user can be linked to employee record)

### Employee Model
Represents company employees with detailed information.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `name` | String | Employee's full name | Required |
| `position` | String | Employee's job position | Required |
| `email` | String | Employee's email address | Required, unique |
| `department` | String | Employee's department | Required |
| `salary` | Float | Employee's base salary | Required |
| `hireDate` | DateTime | Employee's hire date | Required |
| `status` | String | Employee status | Default: "active", options: "active", "inactive", "terminated" |
| `benefits` | Json | Employee benefits package | Required JSON object |
| `phone` | String? | Employee's phone number | Optional |
| `address` | String? | Employee's address | Optional |
| `emergencyContact` | Json? | Emergency contact information | Optional JSON object |
| `skills` | Json? | Employee skills and certifications | Optional JSON array |
| `performance` | Json? | Performance metrics and reviews | Optional JSON object |
| `userId` | String? | Associated user account ID | Optional, unique foreign key |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"active"**: Employee is currently employed (default)
- **"inactive"**: Employee is on leave or inactive
- **"terminated"**: Employee has been terminated

**Relationships:**
- One-to-one with `User` (employee can have one user account)
- One-to-many with `Salary` (employee can have multiple salary records)
- One-to-many with `TimeEntry` (employee can have multiple time entries)

### TimeEntry Model
Represents employee time tracking entries.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `date` | DateTime | Entry date | Required |
| `hours` | Int | Hours worked | Required, range: 0-24 |
| `minutes` | Int | Minutes worked | Required, range: 0-59 |
| `description` | String | Work description | Required |
| `project` | String? | Project name | Optional |
| `status` | String | Entry status | Default: "pending", options: "pending", "approved", "rejected" |
| `userId` | String | Associated user ID | Required, foreign key |
| `employeeId` | String? | Associated employee ID | Optional, foreign key |
| `approvedBy` | String? | Approver user ID | Optional, foreign key |
| `approvedAt` | DateTime? | Approval timestamp | Optional |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Status Values:**
- **"pending"**: Time entry is pending approval (default)
- **"approved"**: Time entry has been approved
- **"rejected"**: Time entry has been rejected

**Relationships:**
- Many-to-one with `User` (time entry belongs to one user)
- Many-to-one with `Employee` (time entry can belong to one employee)
- Many-to-one with `User` (time entry can be approved by one user)

### Salary Model
Represents employee salary records and history.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary key, auto-generated CUID |
| `amount` | Float | Salary amount | Required |
| `effectiveDate` | DateTime | Salary effective date | Required |
| `type` | String | Salary type | Default: "base", options: "base", "bonus", "overtime", "adjustment" |
| `description` | String? | Salary description | Optional |
| `employeeId` | String | Associated employee ID | Required, foreign key |
| `createdAt` | DateTime | Record creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update timestamp | Auto-updated |

**Type Values:**
- **"base"**: Base salary (default)
- **"bonus"**: Performance bonus
- **"overtime"**: Overtime pay
- **"adjustment"**: Salary adjustment

**Relationships:**
- Many-to-one with `Employee` (salary belongs to one employee)

**Usage Examples:**
- **Admin users**: Full system access for user and employee management
- **Employee users**: Time tracking and personal information access
- **Time tracking**: Employee time entry management and approval
- **Salary management**: Employee salary history and adjustments
- **User management**: Admin panel for user and employee administration

## Migration Notes
- Schema changes require Prisma migrations
- Use `npx prisma migrate dev` for development
- Use `npx prisma migrate deploy` for production
