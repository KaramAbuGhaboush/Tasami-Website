"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = exports.authRateLimit = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const prisma = new client_1.PrismaClient();
const failedAttempts = new Map();
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const attemptData = failedAttempts.get(clientIP);
        if (attemptData?.blockedUntil && Date.now() < attemptData.blockedUntil) {
            res.status(429).json({
                success: false,
                message: 'Too many failed attempts. Please try again later.'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, isActive: true }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
            return;
        }
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
            return;
        }
        if (attemptData) {
            failedAttempts.delete(clientIP);
        }
        req.user = user;
        next();
    }
    catch (error) {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        const attemptData = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
        attemptData.count += 1;
        attemptData.lastAttempt = Date.now();
        if (attemptData.count >= 5) {
            attemptData.blockedUntil = Date.now() + (15 * 60 * 1000);
        }
        failedAttempts.set(clientIP, attemptData);
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=auth.js.map