import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { normalizeLocale, transformProjectCategoryByLocale } from '@/server/utils/localization';

/**
 * GET /api/categories/[id] - Get category by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = normalizeLocale(searchParams.get('locale'));

    const category = await prisma.projectCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return createErrorResponse('Category not found', 404);
    }

    const transformedCategory = transformProjectCategoryByLocale(category, locale);

    return createSuccessResponse({ category: transformedCategory });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/categories/[id] - Update category (admin only)
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

    const category = await prisma.projectCategory.update({
      where: { id },
      data: sanitizedData
    });

    return createSuccessResponse({ category }, 'Category updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/categories/[id] - Delete category (admin only)
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

    await prisma.projectCategory.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Category deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

