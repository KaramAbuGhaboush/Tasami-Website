import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { normalizeLocale, transformAuthorByLocale } from '@/server/utils/localization';

/**
 * PUT /api/blog/authors/[id] - Update blog author (admin only)
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
    const { sanitizeObject } = await import('@/lib/validation');
    const sanitizedData = sanitizeObject(body);

    const author = await prisma.blogAuthor.update({
      where: { id },
      data: sanitizedData
    });

    return createSuccessResponse({ author }, 'Author updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/blog/authors/[id] - Delete blog author (admin only)
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

    await prisma.blogAuthor.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Author deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

