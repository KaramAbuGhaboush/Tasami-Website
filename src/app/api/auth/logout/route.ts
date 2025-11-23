import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '@/lib/errors';

/**
 * POST /api/auth/logout - Logout user
 */
export async function POST(request: NextRequest) {
  // Create response
  const response = NextResponse.json(
    createSuccessResponse({}, 'Logout successful')
  );

  // Clear auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}

