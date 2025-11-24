import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

// Track failed login attempts (in-memory, consider Redis for production)
const failedAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

/**
 * Verify JWT token and return user data
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '');
}

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

/**
 * Check if IP is blocked due to failed attempts
 */
export function isIPBlocked(ip: string): boolean {
  const attemptData = failedAttempts.get(ip);
  if (attemptData?.blockedUntil && Date.now() < attemptData.blockedUntil) {
    return true;
  }
  return false;
}

/**
 * Record failed authentication attempt
 */
export function recordFailedAttempt(ip: string): void {
  const attemptData = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attemptData.count += 1;
  attemptData.lastAttempt = Date.now();
  
  // Block IP after 5 failed attempts for 15 minutes
  if (attemptData.count >= 5) {
    attemptData.blockedUntil = Date.now() + (15 * 60 * 1000);
  }
  
  failedAttempts.set(ip, attemptData);
}

/**
 * Clear failed attempts for an IP
 */
export function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * Require authentication - returns user or null
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | null> {
  const token = extractToken(request);
  const clientIP = getClientIP(request);

  if (!token) {
    return null;
  }

  // Check if IP is blocked
  if (isIPBlocked(clientIP)) {
    return null;
  }

  const user = await verifyToken(token);
  
  if (user) {
    // Clear failed attempts on successful authentication
    clearFailedAttempts(clientIP);
  } else {
    // Record failed attempt
    recordFailedAttempt(clientIP);
  }

  return user;
}

/**
 * Require admin role - returns user or null
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  const user = await requireAuth(request);
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return user;
}

