import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { timeEntrySchema, paginationSchema } from '@/lib/validation';
import { startOfWeek, endOfWeek } from 'date-fns';

/**
 * GET /api/time-entries - Get user's time entries
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId: user.id };

    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.date = { gte: today, lt: tomorrow };
    } else if (filter === 'week') {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      where.date = { gte: weekStart, lte: weekEnd };
    }

    const [items, total] = await Promise.all([
      prisma.timeEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' }
      }),
      prisma.timeEntry.count({ where })
    ]);

    return createSuccessResponse({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/time-entries - Create time entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const body = await request.json();
    const validatedData = timeEntrySchema.parse(body);

    const timeEntry = await prisma.timeEntry.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: user.id
      }
    });

    return createSuccessResponse(timeEntry, 'Time entry created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

