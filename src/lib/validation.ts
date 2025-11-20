import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}

/**
 * Sanitize object fields that might contain HTML
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T, htmlFields: string[] = ['content', 'description', 'message', 'bio', 'expertise']): T {
  const sanitized = { ...obj };
  
  for (const field of htmlFields) {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeHtml(sanitized[field]);
    }
  }
  
  return sanitized;
}

/**
 * Validation schemas
 */

// Email validation
export const emailSchema = z.string().email('Please provide a valid email address').toLowerCase().trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be between 2 and 100 characters').max(100, 'Name must be between 2 and 100 characters'),
  email: emailSchema,
  company: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Message must be between 10 and 2000 characters').max(2000, 'Message must be between 10 and 2000 characters'),
  service: z.string().trim().min(2, 'Service must be between 2 and 100 characters').max(100, 'Service must be between 2 and 100 characters'),
  budget: z.string().trim().min(2, 'Budget must be between 2 and 50 characters').max(50, 'Budget must be between 2 and 50 characters'),
});

// Blog article validation
export const blogArticleSchema = z.object({
  title: z.string().trim().min(5, 'Title must be between 5 and 200 characters').max(200, 'Title must be between 5 and 200 characters'),
  titleAr: z.string().trim().optional(),
  excerpt: z.string().trim().min(50, 'Excerpt must be between 50 and 500 characters').max(500, 'Excerpt must be between 50 and 500 characters'),
  excerptAr: z.string().trim().optional(),
  content: z.string().trim().min(100, 'Content must be at least 100 characters'),
  contentAr: z.string().trim().optional(),
  image: z.string().optional(),
  readTime: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  tags: z.array(z.string()).default([]),
  relatedArticles: z.array(z.any()).default([]),
  authorId: z.string().min(1, 'Author ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
});

// Job validation
export const jobSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  titleAr: z.string().trim().optional(),
  department: z.string().trim().min(1, 'Department is required'),
  departmentAr: z.string().trim().optional(),
  location: z.string().trim().min(1, 'Location is required'),
  locationAr: z.string().trim().optional(),
  type: z.string().trim().min(1, 'Type is required'),
  typeAr: z.string().trim().optional(),
  experience: z.string().trim().min(1, 'Experience is required'),
  experienceAr: z.string().trim().optional(),
  description: z.string().trim().min(1, 'Description is required'),
  descriptionAr: z.string().trim().optional(),
  requirements: z.array(z.string()).default([]),
  requirementsAr: z.array(z.string()).optional(),
  benefits: z.array(z.string()).default([]),
  benefitsAr: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'closed']).default('active'),
  applicationDeadline: z.string().datetime().optional(),
  salary: z.string().trim().optional(),
  salaryAr: z.string().trim().optional(),
  team: z.string().trim().optional(),
  teamAr: z.string().trim().optional(),
});

// Testimonial validation
export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  company: z.string().trim().min(1, 'Company is required'),
  quote: z.string().trim().min(10, 'Quote must be at least 10 characters'),
  rating: z.number().int().min(1).max(5).default(5),
  initials: z.string().trim().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Time entry validation
export const timeEntrySchema = z.object({
  date: z.string().datetime(),
  hours: z.number().int().min(0).max(24),
  minutes: z.number().int().min(0).max(59),
  project: z.string().trim().min(1, 'Project is required'),
  description: z.string().trim().optional(),
});

// Employee validation
export const employeeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema,
  password: passwordSchema.optional(),
  phone: z.string().trim().optional(),
  department: z.string().trim().optional(),
  role: z.enum(['admin', 'employee']).default('employee'),
  isActive: z.boolean().default(true),
  weeklyGoal: z.number().int().min(0).max(168).default(40),
});

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File | null,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
    };
  }

  return { valid: true };
}

