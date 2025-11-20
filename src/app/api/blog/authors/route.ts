import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { normalizeLocale, transformAuthorByLocale } from '@/server/utils/localization';

/**
 * GET /api/blog/authors - Get all blog authors
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = normalizeLocale(searchParams.get('locale'));

    const authors = await prisma.blogAuthor.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const transformedAuthors = authors.map(author => transformAuthorByLocale(author, locale));

    return createSuccessResponse({ authors: transformedAuthors });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/blog/authors - Create blog author (admin only)
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

    const author = await prisma.blogAuthor.create({
      data: sanitizedData
    });

    return createSuccessResponse({ author }, 'Author created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

