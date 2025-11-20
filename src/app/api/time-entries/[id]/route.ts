import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { timeEntrySchema } from '@/lib/validation';

/**
 * PUT /api/time-entries/[id] - Update time entry
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = timeEntrySchema.partial().parse(body);

    // Verify ownership
    const existingEntry = await prisma.timeEntry.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      return createErrorResponse('Time entry not found', 404);
    }

    if (existingEntry.userId !== user.id) {
      return createErrorResponse('Access denied', 403);
    }

    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data: updateData
    });

    return createSuccessResponse({ timeEntry }, 'Time entry updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/time-entries/[id] - Delete time entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return createErrorResponse('Access denied. No token provided.', 401);
    }

    const { id } = await params;

    // Verify ownership
    const existingEntry = await prisma.timeEntry.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      return createErrorResponse('Time entry not found', 404);
    }

    if (existingEntry.userId !== user.id) {
      return createErrorResponse('Access denied', 403);
    }

    await prisma.timeEntry.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Time entry deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

