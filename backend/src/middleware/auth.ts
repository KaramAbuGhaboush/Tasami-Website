import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();

// Track failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

// Rate limiter for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    // Check if IP is blocked due to failed attempts
    const attemptData = failedAttempts.get(clientIP);
    if (attemptData?.blockedUntil && Date.now() < attemptData.blockedUntil) {
      res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please try again later.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
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

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
      return;
    }

    // Clear failed attempts on successful authentication
    if (attemptData) {
      failedAttempts.delete(clientIP);
    }

    req.user = user;
    next();
  } catch (error) {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Track failed attempt
    const attemptData = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    attemptData.count += 1;
    attemptData.lastAttempt = Date.now();
    
    // Block IP after 5 failed attempts for 15 minutes
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

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
    return;
  }
  next();
};
