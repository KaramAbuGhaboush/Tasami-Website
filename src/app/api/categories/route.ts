import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import {
  normalizeLocale,
  transformProjectCategoriesByLocale,
} from '@/server/utils/localization';

/**
 * GET /api/categories - Get all project categories
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'active';
    const locale = normalizeLocale(searchParams.get('locale'));

    const where: any = { status };
    if (featured !== undefined) where.featured = featured === 'true';

    const categories = await prisma.projectCategory.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    const transformedCategories = transformProjectCategoriesByLocale(categories, locale);

    return createSuccessResponse({ categories: transformedCategories });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/categories - Create category (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const body = await request.json();
    const { sanitizeObject } = await import('@/lib/validation');
    const sanitizedData = sanitizeObject(body);

    const category = await prisma.projectCategory.create({
      data: sanitizedData
    });

    return createSuccessResponse({ category }, 'Category created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

