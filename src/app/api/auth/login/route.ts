import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { loginSchema } from '@/lib/validation';
import { getClientIP, isIPBlocked, recordFailedAttempt, clearFailedAttempts } from '@/lib/auth';
import { createRateLimit, rateLimiter } from '@/lib/rate-limit';

// Rate limit: 10 attempts per 15 minutes (increased to prevent blocking legitimate users)
const loginRateLimit = createRateLimit({
  limit: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
  identifier: (request: Request) => {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0].trim() || realIP || 'unknown';
  }
});

/**
 * POST /api/auth/login - Login user
 */
export async function POST(request: NextRequest) {
  console.log('[LOGIN] Login request received at:', new Date().toISOString());
  console.log('[LOGIN] Request URL:', request.url);
  console.log('[LOGIN] Request method:', request.method);
  
  try {
    // Get client IP
    const clientIP = getClientIP(request);
    console.log('[LOGIN] Client IP:', clientIP);

    // Check if IP is blocked
    if (isIPBlocked(clientIP)) {
      console.warn(`[SECURITY] Login blocked - IP is blocked: ${clientIP}`);
      // Return generic error to prevent information leakage
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check rate limit
    const rateLimitResult = await loginRateLimit(request);
    if (!rateLimitResult.allowed) {
      console.warn(`[SECURITY] Login blocked - Rate limit exceeded for IP: ${clientIP}, Remaining: ${rateLimitResult.remaining}, Reset at: ${rateLimitResult.resetTime}`);
      // Return generic error to prevent information leakage
      return createErrorResponse('Invalid credentials', 401);
    }

    let body;
    try {
      body = await request.json();
      console.log('[LOGIN] Request body received:', { email: body?.email, hasPassword: !!body?.password });
    } catch (error) {
      console.error('[LOGIN] Error parsing request body:', error);
      return createErrorResponse('Invalid request format', 400);
    }
    
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    console.log('[LOGIN] Validated data - Email:', email);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists
    if (!user) {
      // Record failed attempt
      recordFailedAttempt(clientIP);
      
      // Log security event (without sensitive data)
      console.warn(`[SECURITY] Failed login attempt from IP: ${clientIP}, Email: ${email} - User not found`);
      
      // Return generic error message
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      // Record failed attempt
      recordFailedAttempt(clientIP);
      
      // Log security event
      console.warn(`[SECURITY] Failed login attempt from IP: ${clientIP}, Email: ${email} - Account inactive`);
      
      // Return generic error message
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      // If password comparison fails, log and treat as invalid
      console.error(`[SECURITY] Password comparison error for IP: ${clientIP}, Email: ${email}`, error);
      recordFailedAttempt(clientIP);
      return createErrorResponse('Invalid credentials', 401);
    }

    // Check if password is valid
    if (!isPasswordValid) {
      // Record failed attempt
      recordFailedAttempt(clientIP);
      
      // Log security event (without sensitive data)
      console.warn(`[SECURITY] Failed login attempt from IP: ${clientIP}, Email: ${email} - Invalid password`);
      
      // Return generic error message
      return createErrorResponse('Invalid credentials', 401);
    }

    // Clear failed attempts and rate limit on successful login
    clearFailedAttempts(clientIP);
    // Clear rate limit for this IP on successful login
    rateLimiter.clearIdentifier(clientIP);

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log successful login (without sensitive data)
    console.info(`[SECURITY] Successful login from IP: ${clientIP}, User: ${user.email}, Role: ${user.role}`);

    // Create response with success data
    const response = createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        weeklyGoal: user.weeklyGoal
      },
      token
    }, 'Login successful');
    
    // Set HTTP-only cookie for middleware authentication check
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('[LOGIN] Returning success response');
    return response;
  } catch (error) {
    // Return generic error for any unexpected errors
    return createErrorResponse('Invalid credentials', 401);
  }
}

