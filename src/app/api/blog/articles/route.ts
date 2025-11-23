import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { BlogService } from '@/services/blogService';
import { createRateLimit } from '@/lib/rate-limit';

// Rate limiter: 100 requests per 15 minutes
const rateLimit = createRateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

/**
 * GET /api/blog/articles - Get all blog articles
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'Too many requests. Please try again later.',
        429
      );
    }
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const statusParam = searchParams.get('status');
    const status = statusParam || 'published';
    const locale = searchParams.get('locale') || 'en';

    const result = await BlogService.getArticles({
        page,
        limit,
      category: category || undefined,
      featured: featured ? featured === 'true' : undefined,
      status: status === 'all' ? 'all' : status,
      locale,
    });

    const response = createSuccessResponse(result);

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return response;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/blog/articles - Create a new article (admin only)
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
    const article = await BlogService.createArticle(sanitizedData);

    return createSuccessResponse({ article }, 'Article created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

