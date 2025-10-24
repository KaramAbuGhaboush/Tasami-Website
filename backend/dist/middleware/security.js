"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearFailedAttempts = exports.trackFailedLogin = exports.securityMonitoring = void 0;
const logger_1 = require("../utils/logger");
const failedAttempts = new Map();
const securityMonitoring = (req, res, next) => {
    const startTime = Date.now();
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const logSecurityEvent = (event, details) => {
        logger_1.securityLogger.info({
            event,
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
    ];
    const checkSuspiciousActivity = () => {
        const url = req.url.toLowerCase();
        const body = JSON.stringify(req.body || {}).toLowerCase();
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(url) || pattern.test(body)) {
                logSecurityEvent('SUSPICIOUS_ACTIVITY', {
                    pattern: pattern.toString(),
                    url: req.url,
                    body: req.body
                });
                return true;
            }
        }
        return false;
    };
    const checkFailedAttempts = () => {
        const attempts = failedAttempts.get(clientIP);
        if (attempts) {
            const timeDiff = Date.now() - attempts.lastAttempt;
            if (timeDiff < 15 * 60 * 1000) {
                if (attempts.count >= 5) {
                    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
                        attempts: attempts.count,
                        timeDiff
                    });
                    return true;
                }
            }
            else {
                failedAttempts.delete(clientIP);
            }
        }
        return false;
    };
    if (checkSuspiciousActivity()) {
        return res.status(400).json({
            success: false,
            message: 'Suspicious activity detected'
        });
    }
    if (checkFailedAttempts()) {
        return res.status(429).json({
            success: false,
            message: 'Too many failed attempts. Please try again later.'
        });
    }
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        logger_1.performanceLogger.info({
            method: req.method,
            url: req.url,
            statusCode,
            duration,
            ip: clientIP,
            userAgent: userAgent.substring(0, 100)
        });
        if (duration > 5000) {
            logger_1.performanceLogger.warn({
                event: 'SLOW_REQUEST',
                method: req.method,
                url: req.url,
                duration,
                ip: clientIP
            });
        }
    });
    next();
    return;
};
exports.securityMonitoring = securityMonitoring;
const trackFailedLogin = (ip) => {
    const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    failedAttempts.set(ip, attempts);
    logger_1.securityLogger.warn({
        event: 'FAILED_LOGIN_ATTEMPT',
        ip,
        attempts: attempts.count,
        timestamp: new Date().toISOString()
    });
};
exports.trackFailedLogin = trackFailedLogin;
const clearFailedAttempts = (ip) => {
    failedAttempts.delete(ip);
};
exports.clearFailedAttempts = clearFailedAttempts;
//# sourceMappingURL=security.js.map