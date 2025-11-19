"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tasami API',
            version: '1.0.0',
            description: 'API documentation for Tasami website backend services',
            contact: {
                name: 'Tasami Team',
                email: 'contact@tasami.com',
            },
        },
        servers: [
            {
                url: process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/api` : process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : `${process.env.API_PROTOCOL || 'http'}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3002}/api`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        data: {
                            type: 'object',
                        },
                    },
                },
                BlogArticle: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        excerpt: { type: 'string' },
                        content: { type: 'string' },
                        slug: { type: 'string' },
                        image: { type: 'string' },
                        readTime: { type: 'string' },
                        featured: { type: 'boolean' },
                        status: { type: 'string' },
                        views: { type: 'number' },
                        tags: { type: 'array', items: { type: 'string' } },
                        relatedArticles: { type: 'array' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        author: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                avatar: { type: 'string' },
                                role: { type: 'string' },
                            },
                        },
                        category: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                slug: { type: 'string' },
                                color: { type: 'string' },
                            },
                        },
                    },
                },
                Job: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        department: { type: 'string' },
                        location: { type: 'string' },
                        type: { type: 'string' },
                        experience: { type: 'string' },
                        description: { type: 'string' },
                        requirements: { type: 'array', items: { type: 'string' } },
                        benefits: { type: 'array', items: { type: 'string' } },
                        skills: { type: 'array', items: { type: 'string' } },
                        salary: { type: 'string' },
                        applicationDeadline: { type: 'string', format: 'date-time' },
                        postedDate: { type: 'string', format: 'date-time' },
                        status: { type: 'string' },
                        applications: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ContactMessage: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        company: { type: 'string' },
                        subject: { type: 'string' },
                        message: { type: 'string' },
                        service: { type: 'string' },
                        budget: { type: 'string' },
                        status: { type: 'string' },
                        priority: { type: 'string' },
                        assignedTo: { type: 'string' },
                        notes: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
                BlogCategory: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        color: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                BlogAuthor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        avatar: { type: 'string' },
                        role: { type: 'string' },
                        bio: { type: 'string' },
                        socialLinks: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        image: { type: 'string' },
                        category: { type: 'string' },
                        featured: { type: 'boolean' },
                        status: { type: 'string' },
                        technologies: { type: 'array', items: { type: 'object' } },
                        results: { type: 'array', items: { type: 'object' } },
                        clientTestimonial: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Testimonial: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        clientName: { type: 'string' },
                        clientCompany: { type: 'string' },
                        clientPosition: { type: 'string' },
                        clientAvatar: { type: 'string' },
                        content: { type: 'string' },
                        rating: { type: 'number' },
                        featured: { type: 'boolean' },
                        status: { type: 'string' },
                        project: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ProjectCategory: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        color: { type: 'string' },
                        icon: { type: 'string' },
                        featured: { type: 'boolean' },
                        sortOrder: { type: 'number' },
                        status: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                TimeEntry: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        hours: { type: 'integer' },
                        minutes: { type: 'integer' },
                        project: { type: 'string' },
                        description: { type: 'string' },
                        userId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Employee: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['employee', 'admin'] },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                WeeklySummary: {
                    type: 'object',
                    properties: {
                        totalHours: { type: 'number' },
                        goal: { type: 'number' },
                        remaining: { type: 'number' },
                        progressPercentage: { type: 'number' },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints'
            },
            {
                name: 'Blog',
                description: 'Blog management endpoints'
            },
            {
                name: 'Career',
                description: 'Job and career management endpoints'
            },
            {
                name: 'Contact',
                description: 'Contact message management endpoints'
            },
            {
                name: 'Projects',
                description: 'Project management endpoints'
            },
            {
                name: 'Testimonials',
                description: 'Testimonial management endpoints'
            },
            {
                name: 'Categories',
                description: 'Category management endpoints'
            },
            {
                name: 'Time Entries',
                description: 'Employee time tracking endpoints'
            },
            {
                name: 'Employees',
                description: 'Employee management endpoints (Admin only)'
            },
            {
                name: 'System',
                description: 'System health and test endpoints'
            }
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
//# sourceMappingURL=swagger.js.map