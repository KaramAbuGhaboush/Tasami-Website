import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * GET /api/time-entries/weekly-summary - Get weekly summary
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const entries = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
        date: { gte: weekStart, lte: weekEnd }
      }
    });

    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { weeklyGoal: true }
    });

    const goal = userData?.weeklyGoal || 40;
    const progress = (totalHours / goal) * 100;

    return createSuccessResponse({
      totalHours,
      totalMinutes: remainingMinutes,
      entries,
      goal,
      progress: Math.min(progress, 100)
    });
  } catch (error) {
    return handleError(error);
  }
}

