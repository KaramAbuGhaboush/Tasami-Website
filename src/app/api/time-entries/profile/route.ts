import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';

/**
 * GET /api/time-entries/profile - Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        weeklyGoal: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!userData) {
      return createErrorResponse('User not found', 404);
    }

    return createSuccessResponse({ user: userData });
  } catch (error) {
    return handleError(error);
  }
}

