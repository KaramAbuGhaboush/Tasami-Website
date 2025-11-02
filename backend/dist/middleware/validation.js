"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.createRateLimit = exports.handleValidationErrors = exports.validateBlogArticle = exports.validateContactForm = exports.validatePagination = exports.validateObjectId = exports.validatePassword = exports.validateEmail = exports.sanitizeHtml = void 0;
const express_validator_1 = require("express-validator");
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
const sanitizeHtml = (req, res, next) => {
    if (req.body) {
        const htmlFields = ['content', 'description', 'message', 'bio', 'expertise'];
        for (const field of htmlFields) {
            if (req.body[field] && typeof req.body[field] === 'string') {
                req.body[field] = isomorphic_dompurify_1.default.sanitize(req.body[field]);
            }
        }
    }
    next();
};
exports.sanitizeHtml = sanitizeHtml;
const validateEmail = () => {
    return (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address');
};
exports.validateEmail = validateEmail;
const validatePassword = () => {
    return (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
};
exports.validatePassword = validatePassword;
const validateObjectId = (paramName) => {
    return (0, express_validator_1.param)(paramName)
        .isLength({ min: 24, max: 24 })
        .withMessage('Invalid ID format')
        .matches(/^[0-9a-fA-F]{24}$/)
        .withMessage('Invalid ID format');
};
exports.validateObjectId = validateObjectId;
const validatePagination = () => {
    return [
        (0, express_validator_1.query)('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        (0, express_validator_1.query)('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ];
};
exports.validatePagination = validatePagination;
const validateContactForm = () => {
    return [
        (0, express_validator_1.body)('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),
        (0, express_validator_1.body)('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        (0, express_validator_1.body)('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be between 10 and 2000 characters'),
        (0, express_validator_1.body)('service')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Service must be between 2 and 100 characters'),
        (0, express_validator_1.body)('budget')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Budget must be between 2 and 50 characters')
    ];
};
exports.validateContactForm = validateContactForm;
const validateBlogArticle = () => {
    return [
        (0, express_validator_1.body)('title')
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        (0, express_validator_1.body)('content')
            .trim()
            .isLength({ min: 100 })
            .withMessage('Content must be at least 100 characters'),
        (0, express_validator_1.body)('excerpt')
            .trim()
            .isLength({ min: 50, max: 500 })
            .withMessage('Excerpt must be between 50 and 500 characters'),
        (0, express_validator_1.body)('categoryId')
            .isLength({ min: 24, max: 24 })
            .withMessage('Invalid category ID format')
            .matches(/^[0-9a-fA-F]{24}$/)
            .withMessage('Invalid category ID format')
    ];
};
exports.validateBlogArticle = validateBlogArticle;
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
    return next();
};
exports.handleValidationErrors = handleValidationErrors;
const createRateLimit = (windowMs, max, message) => {
    return {
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
    };
};
exports.createRateLimit = createRateLimit;
const validateFileUpload = (allowedTypes, maxSize) => {
    return (req, res, next) => {
        if (!req.file) {
            return next();
        }
        const file = req.file;
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
            });
        }
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
            });
        }
        next();
    };
};
exports.validateFileUpload = validateFileUpload;
//# sourceMappingURL=validation.js.map