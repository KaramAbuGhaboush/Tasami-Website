import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';

/**
 * GET /api/employees/stats - Get team statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      employeeUsers,
      newUsersThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'employee' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    // Calculate users meeting goals (simplified - would need time entry calculations)
    const usersMeetingGoals = 0; // Placeholder

    return createSuccessResponse({
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      employeeUsers,
      newUsersThisMonth,
      usersMeetingGoals
    });
  } catch (error) {
    return handleError(error);
  }
}

