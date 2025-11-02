"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironment = exports.securityConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.securityConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:3000',
            'http://localhost:3001'
        ],
        credentials: true,
    },
    fileUpload: {
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf'
        ],
    },
    headers: {
        cspEnabled: process.env.HELMET_CSP_ENABLED === 'true',
        hstsEnabled: process.env.HELMET_HSTS_ENABLED === 'true',
    },
    monitoring: {
        securityEnabled: process.env.ENABLE_SECURITY_MONITORING === 'true',
        performanceEnabled: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@tasami.com',
        password: process.env.ADMIN_PASSWORD || 'change-this-password',
    },
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};
const validateEnvironment = () => {
    const required = [
        'JWT_SECRET',
        'DATABASE_URL',
    ];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    if (exports.securityConfig.isProduction) {
        if (process.env.JWT_SECRET === 'fallback-secret-change-in-production') {
            console.warn('⚠️  WARNING: Using fallback JWT secret in production!');
        }
        if (process.env.ADMIN_PASSWORD === 'change-this-password') {
            console.warn('⚠️  WARNING: Using default admin password in production!');
        }
    }
};
exports.validateEnvironment = validateEnvironment;
(0, exports.validateEnvironment)();
//# sourceMappingURL=security.js.map