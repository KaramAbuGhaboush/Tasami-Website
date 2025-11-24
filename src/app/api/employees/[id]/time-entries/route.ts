import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';

/**
 * GET /api/employees/[id]/time-entries - Get employee time entries (admin only)
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { userId: id };
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    return createSuccessResponse({ timeEntries });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/employees/[id]/time-entries - Create time entry for employee (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;
    const body = await request.json();
    const { timeEntrySchema } = await import('@/lib/validation');
    const validatedData = timeEntrySchema.parse(body);

    const timeEntry = await prisma.timeEntry.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: id
      }
    });

    return createSuccessResponse(timeEntry, 'Time entry created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

