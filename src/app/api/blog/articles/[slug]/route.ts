import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import {
  transformArticleByLocale,
  transformCategoryByLocale,
  transformAuthorByLocale,
  normalizeLocale
} from '@/server/utils/localization';

/**
 * GET /api/blog/articles/[slug] - Get article by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = normalizeLocale(searchParams.get('locale'));

    const article = await prisma.blogArticle.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true
      }
    });

    if (!article) {
      return createErrorResponse('Article not found', 404);
    }

    // Increment views
    await prisma.blogArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    // Transform based on locale
    const transformedArticle = transformArticleByLocale(article, locale);
    transformedArticle.category = article.category 
      ? transformCategoryByLocale(article.category, locale) 
      : article.category;
    transformedArticle.author = article.author 
      ? transformAuthorByLocale(article.author, locale) 
      : article.author;

    return createSuccessResponse({ article: transformedArticle });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/blog/articles/[slug] - Update article (admin only)
 * Accepts either slug or ID in the path parameter
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { slug } = await params;
    const body = await request.json();
    const { blogArticleSchema, sanitizeObject } = await import('@/lib/validation');
    
    const validatedData = blogArticleSchema.partial().parse(body);
    const sanitizedData = sanitizeObject(validatedData);

    // Try to find article by slug first, then by ID if not found
    let article = await prisma.blogArticle.findUnique({
      where: { slug }
    });

    // If not found by slug, try by ID (in case frontend passes ID)
    if (!article) {
      article = await prisma.blogArticle.findUnique({
        where: { id: slug }
      });
    }

    if (!article) {
      return createErrorResponse('Article not found', 404);
    }

    const updatedArticle = await prisma.blogArticle.update({
      where: { id: article.id },
      data: sanitizedData,
      include: {
        author: true,
        category: true
      }
    });

    return createSuccessResponse({ article: updatedArticle }, 'Article updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/blog/articles/[slug] - Delete article (admin only)
 * Accepts either slug or ID in the path parameter
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { slug } = await params;

    // Try to find article by slug first, then by ID if not found
    let article = await prisma.blogArticle.findUnique({
      where: { slug }
    });

    // If not found by slug, try by ID (in case frontend passes ID)
    if (!article) {
      article = await prisma.blogArticle.findUnique({
        where: { id: slug }
      });
    }

    if (!article) {
      return createErrorResponse('Article not found', 404);
    }

    await prisma.blogArticle.delete({
      where: { id: article.id }
    });

    return createSuccessResponse(null, 'Article deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

