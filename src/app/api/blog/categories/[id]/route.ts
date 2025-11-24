import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { normalizeLocale, transformCategoryByLocale } from '@/server/utils/localization';

/**
 * PUT /api/blog/categories/[id] - Update blog category (admin only)
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

    const category = await prisma.blogCategory.update({
      where: { id },
      data: sanitizedData
    });

    return createSuccessResponse({ category }, 'Category updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/blog/categories/[id] - Delete blog category (admin only)
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

    await prisma.blogCategory.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Category deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

