import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { BlogService } from '@/services/blogService';

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
    const locale = searchParams.get('locale') || 'en';

    const article = await BlogService.getArticleBySlug(slug, locale);

    if (!article) {
      return createErrorResponse('Article not found', 404);
    }

    const response = createSuccessResponse({ article });

    // Add caching headers - articles change less frequently
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
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
    const { sanitizeObject } = await import('@/lib/validation');
    
    const sanitizedData = sanitizeObject(body);
    const updatedArticle = await BlogService.updateArticle(slug, sanitizedData);

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

    await BlogService.deleteArticle(slug);

    return createSuccessResponse(null, 'Article deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

