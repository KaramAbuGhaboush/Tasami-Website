import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { z } from 'zod';

const weeklyGoalSchema = z.object({
  weeklyGoal: z.number().int().min(0).max(168)
});

/**
 * PUT /api/time-entries/profile/weekly-goal - Update weekly goal
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const body = await request.json();
    const validatedData = weeklyGoalSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { weeklyGoal: validatedData.weeklyGoal },
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

    return createSuccessResponse(
      { user: updatedUser },
      'Weekly goal updated successfully'
    );
  } catch (error) {
    return handleError(error);
  }
}

