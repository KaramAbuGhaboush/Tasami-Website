import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content
export const sanitizeHtml = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Sanitize string fields that might contain HTML
    const htmlFields = ['content', 'description', 'message', 'bio', 'expertise'];
    
    for (const field of htmlFields) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = DOMPurify.sanitize(req.body[field]);
      }
    }
  }
  next();
};

// Validate and sanitize email
export const validateEmail = () => {
  return body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');
};

// Validate password strength
export const validatePassword = () => {
  return body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
};

// Validate MongoDB ObjectId
export const validateObjectId = (paramName: string) => {
  return param(paramName)
    .isLength({ min: 24, max: 24 })
    .withMessage('Invalid ID format')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format');
};

// Validate pagination parameters
export const validatePagination = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ];
};

// Validate contact form
export const validateContactForm = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters'),
    body('service')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Service must be between 2 and 100 characters'),
    body('budget')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Budget must be between 2 and 50 characters')
  ];
};

// Validate blog article
export const validateBlogArticle = () => {
  return [
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('content')
      .trim()
      .isLength({ min: 100 })
      .withMessage('Content must be at least 100 characters'),
    body('excerpt')
      .trim()
      .isLength({ min: 50, max: 500 })
      .withMessage('Excerpt must be between 50 and 500 characters'),
    body('categoryId')
      .isLength({ min: 24, max: 24 })
      .withMessage('Invalid category ID format')
      .matches(/^[0-9a-fA-F]{24}$/)
      .withMessage('Invalid category ID format')
  ];
};

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }))
    });
  }
  
  next();
};

// Rate limiting for specific endpoints
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return {
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  };
};

// Validate file upload
export const validateFileUpload = (allowedTypes: string[], maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    const file = req.file;
    
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Check file size
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
      });
    }

    next();
  };
};
