import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * GET /api/employees/analytics/team-summary - Get team analytics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam ? new Date(startDateParam) : startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endDateParam ? new Date(endDateParam) : endOfWeek(new Date(), { weekStartsOn: 1 });

    const [totalUsers, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } })
    ]);

    // Get all time entries in the period
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      }
    });

    const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const averageHoursPerUser = activeUsers > 0 ? totalHours / activeUsers : 0;

    // Calculate goal achievement
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, weeklyGoal: true }
    });

    let usersMeetingGoals = 0;
    for (const user of users) {
      const userEntries = timeEntries.filter(e => e.userId === user.id);
      const userMinutes = userEntries.reduce((sum, entry) => sum + (entry.hours * 60) + entry.minutes, 0);
      const userHours = Math.floor(userMinutes / 60);
      if (userHours >= user.weeklyGoal) {
        usersMeetingGoals++;
      }
    }

    const goalAchievementRate = activeUsers > 0 ? (usersMeetingGoals / activeUsers) * 100 : 0;

    return createSuccessResponse({
      totalUsers,
      activeUsers,
      totalHours,
      averageHoursPerUser: Math.round(averageHoursPerUser * 100) / 100,
      goalAchievementRate: Math.round(goalAchievementRate * 100) / 100,
      usersMeetingGoals,
      usersExceedingGoals: 0, // Placeholder
      usersBelowGoals: activeUsers - usersMeetingGoals,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

