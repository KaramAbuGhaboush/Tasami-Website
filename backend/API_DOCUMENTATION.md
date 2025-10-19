# Tasami API Documentation

## Overview
This backend API provides endpoints for the Tasami website, including blog articles, job positions, contact messages, and more.

## Interactive Documentation
The API documentation is available through Swagger UI at:
**http://localhost:3002/api-docs**

## Base URL
```
http://localhost:3002/api
```

## Available Endpoints

### Blog
- `GET /blog/articles` - Get all blog articles
- `GET /blog/articles/:slug` - Get article by slug
- `GET /blog/categories` - Get all categories
- `GET /blog/authors` - Get all authors

### Career
- `GET /career/jobs` - Get all job positions
- `GET /career/jobs/:id` - Get job by ID

### Contact
- `POST /contact/messages` - Submit contact message
- `GET /contact/messages` - Get all messages (admin)

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID

### Testimonials
- `GET /testimonials` - Get all testimonials
- `GET /testimonials/:id` - Get testimonial by ID

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

## Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## Pagination
List endpoints support pagination with these query parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

## Development
To start the development server:
```bash
npm run dev
```

The API documentation will be available at `http://localhost:3002/api-docs`
