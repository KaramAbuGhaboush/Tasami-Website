import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';

/**
 * GET /api/employees/analytics/project-distribution - Get project distribution (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const timeEntries = await prisma.timeEntry.findMany();

    // Group by project
    const projectMap = new Map<string, number>();
    timeEntries.forEach(entry => {
      const current = projectMap.get(entry.project) || 0;
      projectMap.set(entry.project, current + entry.hours + (entry.minutes / 60));
    });

    const totalHours = Array.from(projectMap.values()).reduce((sum, hours) => sum + hours, 0);

    const projects = Array.from(projectMap.entries()).map(([name, hours]) => ({
      name,
      hours: Math.round(hours * 100) / 100,
      percentage: totalHours > 0 ? Math.round((hours / totalHours) * 100 * 100) / 100 : 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
    })).sort((a, b) => b.hours - a.hours);

    return createSuccessResponse({ projects });
  } catch (error) {
    return handleError(error);
  }
}

