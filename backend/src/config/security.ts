import dotenv from 'dotenv';

dotenv.config();

export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true,
  },

  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ],
  },

  // Security Headers
  headers: {
    cspEnabled: process.env.HELMET_CSP_ENABLED === 'true',
    hstsEnabled: process.env.HELMET_HSTS_ENABLED === 'true',
  },

  // Monitoring
  monitoring: {
    securityEnabled: process.env.ENABLE_SECURITY_MONITORING === 'true',
    performanceEnabled: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
  },

  // Admin Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@tasami.com',
    password: process.env.ADMIN_PASSWORD || 'change-this-password',
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = [
    'JWT_SECRET',
    'DATABASE_URL',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about insecure configurations in production
  if (securityConfig.isProduction) {
    if (process.env.JWT_SECRET === 'fallback-secret-change-in-production') {
      console.warn('⚠️  WARNING: Using fallback JWT secret in production!');
    }
    
    if (process.env.ADMIN_PASSWORD === 'change-this-password') {
      console.warn('⚠️  WARNING: Using default admin password in production!');
    }
  }
};

// Initialize security configuration
validateEnvironment();
