import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';

/**
 * PUT /api/contact/messages/[id] - Update message (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;
    const body = await request.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: body
    });

    return createSuccessResponse({ message }, 'Message updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/contact/messages/[id] - Delete message (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Message deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

