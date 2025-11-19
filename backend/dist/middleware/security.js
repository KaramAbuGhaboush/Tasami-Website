"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.ipWhitelist = exports.requestSizeLimit = exports.securityMonitoring = exports.authRateLimit = exports.strictRateLimit = exports.generalRateLimit = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", ...(process.env.BACKEND_URL ? [process.env.BACKEND_URL] : process.env.NODE_ENV === 'development' ? [`${process.env.API_PROTOCOL || 'http'}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3002}`] : [])],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : process.env.NODE_ENV === 'development' ? [`${process.env.FRONTEND_PROTOCOL || 'http'}://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || '3000'}`] : [])],
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
exports.generalRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.strictRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
const securityMonitoring = (req, res, next) => {
    const startTime = Date.now();
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const logSecurityEvent = (event, details) => {
        console.log(`[SECURITY] ${event}:`, {
            ip: clientIP,
            userAgent,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString(),
            ...details
        });
    };
    const suspiciousPatterns = [
        /\.\./,
        /<script/i,
        /union.*select/i,
        /javascript:/i,
        /onload=/i,
        /eval\(/i,
        /document\.cookie/i,
        /alert\(/i,
    ];
    const checkSuspiciousActivity = () => {
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
    const checkAttackPatterns = () => {
        const url = req.url.toLowerCase();
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
    const checkSuspiciousUserAgent = () => {
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
    if (checkSuspiciousActivity()) {
        res.status(400).json({
            success: false,
            message: 'Suspicious activity detected'
        });
        return;
    }
    checkAttackPatterns();
    checkSuspiciousUserAgent();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        if (duration > 5000) {
            logSecurityEvent('SLOW_REQUEST', {
                duration,
                statusCode,
                url: req.url
            });
        }
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
exports.securityMonitoring = securityMonitoring;
const requestSizeLimit = (maxSize) => {
    return (req, res, next) => {
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
exports.requestSizeLimit = requestSizeLimit;
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
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
exports.ipWhitelist = ipWhitelist;
const requestLogger = (req, res, next) => {
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
exports.requestLogger = requestLogger;
//# sourceMappingURL=security.js.map