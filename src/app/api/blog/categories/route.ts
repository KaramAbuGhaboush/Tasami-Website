import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import {
  normalizeLocale,
  transformCategoriesByLocale,
} from '@/server/utils/localization';

/**
 * GET /api/blog/categories - Get all blog categories
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = normalizeLocale(searchParams.get('locale'));

    const categories = await prisma.blogCategory.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const transformedCategories = transformCategoriesByLocale(categories, locale);

    return createSuccessResponse({ categories: transformedCategories });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * POST /api/blog/categories - Create blog category (admin only)
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

    // Generate slug from name if not provided
    if (!sanitizedData.slug && sanitizedData.name) {
      let baseSlug = generateSlug(sanitizedData.name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug is unique
      while (await prisma.blogCategory.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      sanitizedData.slug = slug;
    }

    const category = await prisma.blogCategory.create({
      data: sanitizedData
    });

    return createSuccessResponse({ category }, 'Category created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

