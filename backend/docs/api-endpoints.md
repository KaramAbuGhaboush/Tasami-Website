# API Endpoints Documentation

## Overview
This document describes the REST API endpoints for the Tasami Website backend, focusing on blog and articles functionality. All endpoints return JSON responses with a consistent structure.

## Base URL
```
http://localhost:3000/api/blog
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": object | null,
  "message": string,
  "pagination": object (for paginated endpoints)
}
```

## Blog Articles Endpoints

### GET /articles
Retrieve a paginated list of blog articles.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by category slug
- `featured` (boolean, optional): Filter featured articles
- `status` (string, optional): Filter by status (default: "published")

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "string",
        "title": "string",
        "excerpt": "string",
        "slug": "string",
        "image": "string",
        "readTime": "string",
        "featured": boolean,
        "status": "string",
        "views": number,
        "tags": ["string"],
        "relatedArticles": ["string"],
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "author": {
          "id": "string",
          "name": "string",
          "avatar": "string",
          "role": "string"
        },
        "category": {
          "id": "string",
          "name": "string",
          "slug": "string",
          "color": "string"
        }
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /articles/:slug
Retrieve a single article by slug. Automatically increments view count.

**Parameters:**
- `slug` (string, required): Article slug

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "string",
      "title": "string",
      "excerpt": "string",
      "content": "string",
      "slug": "string",
      "image": "string",
      "readTime": "string",
      "featured": boolean,
      "status": "string",
      "views": number,
      "tags": ["string"],
      "relatedArticles": ["string"],
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "author": {
        "id": "string",
        "name": "string",
        "avatar": "string",
        "role": "string",
        "bio": "string"
      },
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "color": "string"
      }
    }
  }
}
```

### POST /articles (Admin)
Create a new blog article.

**Request Body:**
```json
{
  "title": "string (required)",
  "excerpt": "string (required)",
  "content": "string (required)",
  "image": "string (optional)",
  "readTime": "string (optional, default: '5')",
  "featured": "boolean (optional, default: false)",
  "status": "string (optional, default: 'draft')",
  "tags": ["string"] (optional, default: []),
  "authorId": "string (optional, uses default if not provided)",
  "categoryId": "string (optional, uses default if not provided)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      // Full article object with author and category details
    }
  }
}
```

### PUT /articles/:id (Admin)
Update an existing blog article.

**Parameters:**
- `id` (string, required): Article ID

**Request Body:**
```json
{
  "title": "string (optional)",
  "excerpt": "string (optional)",
  "content": "string (optional)",
  "image": "string (optional)",
  "readTime": "string (optional)",
  "featured": "boolean (optional)",
  "status": "string (optional)",
  "tags": ["string"] (optional),
  "authorId": "string (optional)",
  "categoryId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      // Updated article object with author and category details
    }
  }
}
```

### DELETE /articles/:id (Admin)
Delete a blog article.

**Parameters:**
- `id` (string, required): Article ID

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## Blog Categories Endpoints

### GET /categories
Retrieve all blog categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "color": "string",
        "icon": "string",
        "seoTitle": "string",
        "seoDescription": "string",
        "featured": boolean,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### POST /categories (Admin)
Create a new blog category.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "color": "string (optional, default: '#6812F7')",
  "icon": "string (optional, default: '📝')",
  "featured": "boolean (optional, default: false)",
  "seoTitle": "string (optional)",
  "seoDescription": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      // Full category object
    }
  }
}
```

### PUT /categories/:id (Admin)
Update an existing blog category.

**Parameters:**
- `id` (string, required): Category ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "color": "string (optional)",
  "icon": "string (optional)",
  "featured": "boolean (optional)",
  "seoTitle": "string (optional)",
  "seoDescription": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      // Updated category object
    }
  }
}
```

### DELETE /categories/:id (Admin)
Delete a blog category.

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Blog Authors Endpoints

### GET /authors
Retrieve all blog authors.

**Response:**
```json
{
  "success": true,
  "data": {
    "authors": [
      {
        "id": "string",
        "name": "string",
        "role": "string",
        "email": "string",
        "avatar": "string",
        "bio": "string",
        "socialLinks": {},
        "expertise": ["string"],
        "joinDate": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### POST /authors (Admin)
Create a new blog author.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "role": "string (optional, default: 'Author')",
  "avatar": "string (optional, default: '👤')",
  "bio": "string (optional)",
  "socialLinks": {} (optional),
  "expertise": ["string"] (optional, default: [])
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "author": {
      // Full author object
    }
  }
}
```

### PUT /authors/:id (Admin)
Update an existing blog author.

**Parameters:**
- `id` (string, required): Author ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "role": "string (optional)",
  "avatar": "string (optional)",
  "bio": "string (optional)",
  "socialLinks": {} (optional),
  "expertise": ["string"] (optional)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "author": {
      // Updated author object
    }
  }
}
```

### DELETE /authors/:id (Admin)
Delete a blog author.

**Parameters:**
- `id` (string, required): Author ID

**Response:**
```json
{
  "success": true,
  "message": "Author deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Authentication
- Public endpoints: GET requests for articles, categories, and authors
- Admin endpoints: POST, PUT, DELETE requests require authentication
- Authentication implementation details to be added when auth middleware is implemented

## Rate Limiting
- No rate limiting currently implemented
- To be added in future versions

## CORS
- CORS configuration to be documented when implemented
- Currently allows all origins (development setup)

## Company Information Endpoints

### GET /company/info
Retrieve company information by type or all information.

**Query Parameters:**
- `type` (string, optional): Filter by content type ("hero", "culture", "stats", "values")

**Response:**
```json
{
  "success": true,
  "data": {
    "companyInfo": [
      {
        "id": "string",
        "type": "string",
        "title": "string",
        "content": "string",
        "data": {},
        "featured": boolean,
        "order": number,
        "status": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### GET /company/stats
Retrieve company statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "id": "string",
        "label": "string",
        "value": "string",
        "description": "string",
        "icon": "string",
        "color": "string",
        "featured": boolean,
        "order": number,
        "status": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### POST /company/info (Admin)
Create new company information.

**Request Body:**
```json
{
  "type": "string (required)",
  "title": "string (optional)",
  "content": "string (required)",
  "data": {} (optional),
  "featured": "boolean (optional, default: false)",
  "order": "number (optional, default: 0)",
  "status": "string (optional, default: 'active')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companyInfo": {
      // Full company info object
    }
  }
}
```

### PUT /company/info/:id (Admin)
Update company information.

**Parameters:**
- `id` (string, required): Company info ID

**Request Body:**
```json
{
  "type": "string (optional)",
  "title": "string (optional)",
  "content": "string (optional)",
  "data": {} (optional),
  "featured": "boolean (optional)",
  "order": "number (optional)",
  "status": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companyInfo": {
      // Updated company info object
    }
  }
}
```

### DELETE /company/info/:id (Admin)
Delete company information.

**Parameters:**
- `id` (string, required): Company info ID

**Response:**
```json
{
  "success": true,
  "message": "Company information deleted successfully"
}
```

### POST /company/stats (Admin)
Create new company statistic.

**Request Body:**
```json
{
  "label": "string (required)",
  "value": "string (required)",
  "description": "string (optional)",
  "icon": "string (optional)",
  "color": "string (optional)",
  "featured": "boolean (optional, default: false)",
  "order": "number (optional, default: 0)",
  "status": "string (optional, default: 'active')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stat": {
      // Full stat object
    }
  }
}
```

### PUT /company/stats/:id (Admin)
Update company statistic.

**Parameters:**
- `id` (string, required): Stat ID

**Request Body:**
```json
{
  "label": "string (optional)",
  "value": "string (optional)",
  "description": "string (optional)",
  "icon": "string (optional)",
  "color": "string (optional)",
  "featured": "boolean (optional)",
  "order": "number (optional)",
  "status": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stat": {
      // Updated stat object
    }
  }
}
```

### DELETE /company/stats/:id (Admin)
Delete company statistic.

**Parameters:**
- `id` (string, required): Stat ID

**Response:**
```json
{
  "success": true,
  "message": "Company statistic deleted successfully"
}
```

## Testimonial Endpoints

### GET /testimonials
Retrieve all testimonials with optional filtering.

**Query Parameters:**
- `featured` (boolean, optional): Filter by featured testimonials
- `status` (string, optional): Filter by status ("active", "inactive")

**Response:**
```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": "string",
        "name": "string",
        "role": "string",
        "company": "string",
        "quote": "string",
        "rating": number,
        "initials": "string",
        "featured": boolean,
        "status": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### GET /testimonials/:id
Retrieve a single testimonial by ID.

**Parameters:**
- `id` (string, required): Testimonial ID

**Response:**
```json
{
  "success": true,
  "data": {
    "testimonial": {
      "id": "string",
      "name": "string",
      "role": "string",
      "company": "string",
      "quote": "string",
      "rating": number,
      "initials": "string",
      "featured": boolean,
      "status": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### POST /testimonials (Admin)
Create a new testimonial.

**Request Body:**
```json
{
  "name": "string (required)",
  "role": "string (optional)",
  "company": "string (optional)",
  "quote": "string (required)",
  "rating": "number (optional, default: 5)",
  "initials": "string (optional)",
  "featured": "boolean (optional, default: false)",
  "status": "string (optional, default: 'active')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "testimonial": {
      // Full testimonial object
    }
  }
}
```

### PUT /testimonials/:id (Admin)
Update a testimonial.

**Parameters:**
- `id` (string, required): Testimonial ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "role": "string (optional)",
  "company": "string (optional)",
  "quote": "string (optional)",
  "rating": "number (optional)",
  "initials": "string (optional)",
  "featured": "boolean (optional)",
  "status": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "testimonial": {
      // Updated testimonial object
    }
  }
}
```

### DELETE /testimonials/:id (Admin)
Delete a testimonial.

**Parameters:**
- `id` (string, required): Testimonial ID

**Response:**
```json
{
  "success": true,
  "message": "Testimonial deleted successfully"
}
```

## Project Endpoints

### GET /projects
Retrieve all projects with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `category` (string, optional): Filter by category
- `featured` (boolean, optional): Filter by featured projects
- `status` (string, optional): Filter by status ("planning", "active", "completed", "archived")

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "headerImage": "string",
        "challenge": "string",
        "solution": "string",
        "timeline": "string",
        "teamSize": "string",
        "status": "string",
        "featured": boolean,
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "category": {
          "id": "string",
          "name": "string",
          "slug": "string",
          "color": "string",
          "icon": "string"
        },
        "technologies": [
          {
            "id": "string",
            "name": "string",
            "description": "string"
          }
        ],
        "results": [
          {
            "id": "string",
            "metric": "string",
            "description": "string"
          }
        ],
        "clientTestimonial": {
          "id": "string",
          "quote": "string",
          "author": "string",
          "position": "string"
        }
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /projects/:id
Retrieve a single project by ID.

**Parameters:**
- `id` (string, required): Project ID

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "string",
      "title": "string",
      "description": "string",
      "headerImage": "string",
      "challenge": "string",
      "solution": "string",
      "timeline": "string",
      "teamSize": "string",
      "status": "string",
      "featured": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "color": "string",
        "icon": "string"
      },
      "technologies": [
        {
          "id": "string",
          "name": "string",
          "description": "string"
        }
      ],
      "results": [
        {
          "id": "string",
          "metric": "string",
          "description": "string"
        }
      ],
      "clientTestimonial": {
        "id": "string",
        "quote": "string",
        "author": "string",
        "position": "string"
      }
    }
  }
}
```

### POST /projects (Admin)
Create a new project.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "headerImage": "string (optional)",
  "challenge": "string (optional)",
  "solution": "string (optional)",
  "timeline": "string (optional)",
  "teamSize": "string (optional)",
  "status": "string (optional, default: 'planning')",
  "featured": "boolean (optional, default: false)",
  "categoryId": "string (required)",
  "technologies": [
    {
      "name": "string (required)",
      "description": "string (required)"
    }
  ],
  "results": [
    {
      "metric": "string (required)",
      "description": "string (required)"
    }
  ],
  "clientTestimonial": {
    "quote": "string (optional)",
    "author": "string (optional)",
    "position": "string (optional)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      // Full project object with all relationships
    }
  }
}
```

### PUT /projects/:id (Admin)
Update a project.

**Parameters:**
- `id` (string, required): Project ID

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "headerImage": "string (optional)",
  "challenge": "string (optional)",
  "solution": "string (optional)",
  "timeline": "string (optional)",
  "teamSize": "string (optional)",
  "status": "string (optional)",
  "featured": "boolean (optional)",
  "categoryId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      // Updated project object
    }
  }
}
```

### DELETE /projects/:id (Admin)
Delete a project.

**Parameters:**
- `id` (string, required): Project ID

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## Project Category Endpoints

### GET /categories
Retrieve all project categories.

**Query Parameters:**
- `featured` (boolean, optional): Filter by featured categories
- `status` (string, optional): Filter by status ("active", "inactive")

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "color": "string",
        "icon": "string",
        "featured": boolean,
        "sortOrder": number,
        "status": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### GET /categories/:id
Retrieve a single category by ID.

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "color": "string",
      "icon": "string",
      "featured": boolean,
      "sortOrder": number,
      "status": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### POST /categories (Admin)
Create a new project category.

**Request Body:**
```json
{
  "name": "string (required)",
  "slug": "string (required)",
  "description": "string (optional)",
  "color": "string (optional)",
  "icon": "string (optional)",
  "featured": "boolean (optional, default: false)",
  "sortOrder": "number (optional, default: 0)",
  "status": "string (optional, default: 'active')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      // Full category object
    }
  }
}
```

### PUT /categories/:id (Admin)
Update a project category.

**Parameters:**
- `id` (string, required): Category ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "slug": "string (optional)",
  "description": "string (optional)",
  "color": "string (optional)",
  "icon": "string (optional)",
  "featured": "boolean (optional)",
  "sortOrder": "number (optional)",
  "status": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      // Updated category object
    }
  }
}
```

### DELETE /categories/:id (Admin)
Delete a project category.

**Parameters:**
- `id` (string, required): Category ID

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## User Management Endpoints

### GET /users
Retrieve all users with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `role` (string, optional): Filter by role ("admin", "employee", "user")
- `status` (string, optional): Filter by status ("active", "inactive", "suspended")
- `department` (string, optional): Filter by department

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "email": "string",
        "name": "string",
        "role": "string",
        "avatar": "string",
        "phone": "string",
        "department": "string",
        "position": "string",
        "status": "string",
        "lastLogin": "datetime",
        "emailVerified": boolean,
        "twoFactorEnabled": boolean,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /users/:id
Retrieve a single user by ID.

**Parameters:**
- `id` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string",
      "avatar": "string",
      "phone": "string",
      "department": "string",
      "position": "string",
      "status": "string",
      "lastLogin": "datetime",
      "emailVerified": boolean,
      "twoFactorEnabled": boolean,
      "preferences": {},
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### POST /users (Admin)
Create a new user.

**Request Body:**
```json
{
  "email": "string (required)",
  "name": "string (optional)",
  "password": "string (required)",
  "role": "string (optional, default: 'user')",
  "avatar": "string (optional)",
  "phone": "string (optional)",
  "department": "string (optional)",
  "position": "string (optional)",
  "status": "string (optional, default: 'active')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      // Full user object
    }
  }
}
```

### PUT /users/:id (Admin)
Update a user.

**Parameters:**
- `id` (string, required): User ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "role": "string (optional)",
  "avatar": "string (optional)",
  "phone": "string (optional)",
  "department": "string (optional)",
  "position": "string (optional)",
  "status": "string (optional)",
  "preferences": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### DELETE /users/:id (Admin)
Delete a user.

**Parameters:**
- `id` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Employee Management Endpoints

### GET /employees
Retrieve all employees with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `department` (string, optional): Filter by department
- `status` (string, optional): Filter by status ("active", "inactive", "terminated")
- `position` (string, optional): Filter by position

**Response:**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "string",
        "name": "string",
        "position": "string",
        "email": "string",
        "department": "string",
        "salary": number,
        "hireDate": "datetime",
        "status": "string",
        "benefits": {},
        "phone": "string",
        "address": "string",
        "emergencyContact": {},
        "skills": [],
        "performance": {},
        "userId": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /employees/:id
Retrieve a single employee by ID.

**Parameters:**
- `id` (string, required): Employee ID

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "string",
      "name": "string",
      "position": "string",
      "email": "string",
      "department": "string",
      "salary": number,
      "hireDate": "datetime",
      "status": "string",
      "benefits": {},
      "phone": "string",
      "address": "string",
      "emergencyContact": {},
      "skills": [],
      "performance": {},
      "userId": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "user": {
        "id": "string",
        "email": "string",
        "name": "string",
        "role": "string"
      },
      "salaries": [
        {
          "id": "string",
          "amount": number,
          "effectiveDate": "datetime",
          "type": "string",
          "description": "string"
        }
      ]
    }
  }
}
```

### POST /employees (Admin)
Create a new employee.

**Request Body:**
```json
{
  "name": "string (required)",
  "position": "string (required)",
  "email": "string (required)",
  "department": "string (required)",
  "salary": "number (required)",
  "hireDate": "datetime (required)",
  "status": "string (optional, default: 'active')",
  "benefits": "object (required)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "emergencyContact": "object (optional)",
  "skills": "array (optional)",
  "performance": "object (optional)",
  "userId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      // Full employee object
    }
  }
}
```

### PUT /employees/:id (Admin)
Update an employee.

**Parameters:**
- `id` (string, required): Employee ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "position": "string (optional)",
  "department": "string (optional)",
  "salary": "number (optional)",
  "status": "string (optional)",
  "benefits": "object (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "emergencyContact": "object (optional)",
  "skills": "array (optional)",
  "performance": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      // Updated employee object
    }
  }
}
```

### DELETE /employees/:id (Admin)
Delete an employee.

**Parameters:**
- `id` (string, required): Employee ID

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

## Time Tracking Endpoints

### GET /time-entries
Retrieve all time entries with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `userId` (string, optional): Filter by user ID
- `employeeId` (string, optional): Filter by employee ID
- `status` (string, optional): Filter by status ("pending", "approved", "rejected")
- `dateFrom` (string, optional): Filter from date (ISO string)
- `dateTo` (string, optional): Filter to date (ISO string)
- `project` (string, optional): Filter by project name

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntries": [
      {
        "id": "string",
        "date": "datetime",
        "hours": number,
        "minutes": number,
        "description": "string",
        "project": "string",
        "status": "string",
        "userId": "string",
        "employeeId": "string",
        "approvedBy": "string",
        "approvedAt": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "user": {
          "id": "string",
          "name": "string",
          "email": "string"
        },
        "employee": {
          "id": "string",
          "name": "string",
          "position": "string"
        }
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /time-entries/:id
Retrieve a single time entry by ID.

**Parameters:**
- `id` (string, required): Time entry ID

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntry": {
      "id": "string",
      "date": "datetime",
      "hours": number,
      "minutes": number,
      "description": "string",
      "project": "string",
      "status": "string",
      "userId": "string",
      "employeeId": "string",
      "approvedBy": "string",
      "approvedAt": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "employee": {
        "id": "string",
        "name": "string",
        "position": "string"
      }
    }
  }
}
```

### POST /time-entries
Create a new time entry.

**Request Body:**
```json
{
  "date": "datetime (required)",
  "hours": "number (required)",
  "minutes": "number (required)",
  "description": "string (required)",
  "project": "string (optional)",
  "employeeId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntry": {
      // Full time entry object
    }
  }
}
```

### PUT /time-entries/:id
Update a time entry.

**Parameters:**
- `id` (string, required): Time entry ID

**Request Body:**
```json
{
  "date": "datetime (optional)",
  "hours": "number (optional)",
  "minutes": "number (optional)",
  "description": "string (optional)",
  "project": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntry": {
      // Updated time entry object
    }
  }
}
```

### PUT /time-entries/:id/approve (Admin)
Approve a time entry.

**Parameters:**
- `id` (string, required): Time entry ID

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntry": {
      // Updated time entry object with approved status
    }
  }
}
```

### PUT /time-entries/:id/reject (Admin)
Reject a time entry.

**Parameters:**
- `id` (string, required): Time entry ID

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeEntry": {
      // Updated time entry object with rejected status
    }
  }
}
```

### DELETE /time-entries/:id
Delete a time entry.

**Parameters:**
- `id` (string, required): Time entry ID

**Response:**
```json
{
  "success": true,
  "message": "Time entry deleted successfully"
}
```

## Contact Form Endpoints

### GET /contact/messages
Retrieve all contact messages with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status ("new", "read", "replied", "closed")
- `priority` (string, optional): Filter by priority ("low", "medium", "high")
- `source` (string, optional): Filter by source ("website", "email", "phone")

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "subject": "string",
        "message": "string",
        "service": "string",
        "budget": "string",
        "timeline": "string",
        "status": "string",
        "priority": "string",
        "source": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    }
  }
}
```

### GET /contact/messages/:id
Retrieve a single contact message by ID.

**Parameters:**
- `id` (string, required): Message ID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "subject": "string",
      "message": "string",
      "service": "string",
      "budget": "string",
      "timeline": "string",
      "status": "string",
      "priority": "string",
      "source": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### POST /contact/messages
Submit a new contact message (public).

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "company": "string (optional)",
  "subject": "string (required)",
  "message": "string (required)",
  "service": "string (optional)",
  "budget": "string (optional)",
  "timeline": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "contactMessage": {
      // Full message object
    }
  }
}
```

### PUT /contact/messages/:id (Admin)
Update a contact message status and priority.

**Parameters:**
- `id` (string, required): Message ID

**Request Body:**
```json
{
  "status": "string (optional, options: 'new', 'read', 'replied', 'closed')",
  "priority": "string (optional, options: 'low', 'medium', 'high')",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      // Updated message object
    }
  }
}
```

### DELETE /contact/messages/:id (Admin)
Delete a contact message.

**Parameters:**
- `id` (string, required): Message ID

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### GET /contact/stats
Get contact message statistics for admin dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": number,
      "new": number,
      "read": number,
      "replied": number,
      "closed": number,
      "thisWeek": number,
      "thisMonth": number,
      "byPriority": {
        "low": number,
        "medium": number,
        "high": number
      },
      "bySource": {
        "website": number,
        "email": number,
        "phone": number
      }
    }
  }
}
```

## Notes
- All timestamps are in ISO 8601 format
- Slugs are auto-generated from titles/names using lowercase and hyphens
- Default author and category IDs are used when not provided in article creation
- View counts are automatically incremented when articles are accessed
- JSON fields (tags, socialLinks, expertise) are stored as arrays or objects
- Company information supports flexible data structures for different content types
- Company stats can be ordered and featured for display priority
- Contact messages are automatically assigned status "new" and priority "medium" on creation
- Contact message status options: "new", "read", "replied", "closed"
- Contact message priority options: "low", "medium", "high"
- Testimonials support star ratings from 1-5 with default rating of 5
- Testimonial status options: "active", "inactive"
- Testimonials can be featured for special display on work page carousel
- Testimonial initials are auto-generated from name if not provided
