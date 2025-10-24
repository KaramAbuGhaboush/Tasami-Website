import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Enhanced security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:3002"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Security monitoring middleware
export const securityMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';

  // Log security events
  const logSecurityEvent = (event: string, details: any) => {
    console.log(`[SECURITY] ${event}:`, {
      ip: clientIP,
      userAgent,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...details
    });
  };

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /onload=/i, // Event handler injection
    /eval\(/i, // Code injection
    /document\.cookie/i, // Cookie theft attempts
    /alert\(/i, // XSS attempts
  ];

  const checkSuspiciousActivity = (): boolean => {
    const url = req.url.toLowerCase();
    const body = JSON.stringify(req.body || {}).toLowerCase();
    const query = JSON.stringify(req.query || {}).toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url) || pattern.test(body) || pattern.test(query)) {
        logSecurityEvent('SUSPICIOUS_ACTIVITY', {
          pattern: pattern.toString(),
          url: req.url,
          body: req.body,
          query: req.query
        });
        return true;
      }
    }
    return false;
  };

  // Check for common attack patterns
  const checkAttackPatterns = (): void => {
    const url = req.url.toLowerCase();
    
    // Check for common attack paths
    const attackPaths = [
      '/admin',
      '/wp-admin',
      '/phpmyadmin',
      '/.env',
      '/config',
      '/backup',
      '/test',
      '/api/v1',
      '/swagger',
    ];

    for (const path of attackPaths) {
      if (url.includes(path)) {
        logSecurityEvent('SUSPICIOUS_PATH_ACCESS', {
          path,
          url: req.url
        });
      }
    }
  };

  // Check for suspicious user agents
  const checkSuspiciousUserAgent = (): void => {
    const suspiciousAgents = [
      'sqlmap',
      'nikto',
      'nmap',
      'masscan',
      'zap',
      'burp',
      'w3af',
      'acunetix',
      'nessus',
      'openvas'
    ];

    for (const agent of suspiciousAgents) {
      if (userAgent.toLowerCase().includes(agent)) {
        logSecurityEvent('SUSPICIOUS_USER_AGENT', {
          userAgent,
          agent
        });
      }
    }
  };

  // Perform security checks
  if (checkSuspiciousActivity()) {
    res.status(400).json({
      success: false,
      message: 'Suspicious activity detected'
    });
    return;
  }

  checkAttackPatterns();
  checkSuspiciousUserAgent();

  // Log request completion
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log slow requests
    if (duration > 5000) {
      logSecurityEvent('SLOW_REQUEST', {
        duration,
        statusCode,
        url: req.url
      });
    }

    // Log error responses
    if (statusCode >= 400) {
      logSecurityEvent('ERROR_RESPONSE', {
        statusCode,
        duration,
        url: req.url
      });
    }
  });

  next();
};

// Request size limiter
export const requestSizeLimit = (maxSize: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.get('content-length') || '0');
    
    if (contentLength > maxSize) {
      res.status(413).json({
        success: false,
        message: 'Request entity too large'
      });
      return;
    }
    
    next();
  };
};

// IP whitelist middleware (for admin endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!allowedIPs.includes(clientIP)) {
      res.status(403).json({
        success: false,
        message: 'Access denied from this IP address'
      });
      return;
    }
    
    next();
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    console.log(`[REQUEST] ${req.method} ${req.url} - ${statusCode} - ${duration}ms - ${clientIP} - ${userAgent}`);
  });

  next();
};
