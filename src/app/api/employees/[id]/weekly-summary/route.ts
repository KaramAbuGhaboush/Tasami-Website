import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * GET /api/employees/[id]/weekly-summary - Get employee weekly summary (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const weekStart = startDateParam ? new Date(startDateParam) : startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endDateParam ? new Date(endDateParam) : endOfWeek(new Date(), { weekStartsOn: 1 });

    const entries = await prisma.timeEntry.findMany({
      where: {
        userId: id,
        date: { gte: weekStart, lte: weekEnd }
      }
    });

    const totalMinutes = entries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const userData = await prisma.user.findUnique({
      where: { id },
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

