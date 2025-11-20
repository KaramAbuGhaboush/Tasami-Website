import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { paginationSchema } from '@/lib/validation';
import {
  transformArticlesByLocale,
  transformCategoryByLocale,
  transformAuthorByLocale,
  normalizeLocale
} from '@/server/utils/localization';

/**
 * GET /api/blog/articles - Get all blog articles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'published';
    const locale = normalizeLocale(searchParams.get('locale'));

    const skip = (page - 1) * limit;

    const where: any = { status };
    if (category) where.category = { slug: category };
    if (featured !== undefined) where.featured = featured === 'true';

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              avatar: true,
              role: true,
              roleAr: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              slug: true,
              color: true
            }
          }
        }
      }),
      prisma.blogArticle.count({ where })
    ]);

    // Transform articles based on locale
    const transformedArticles = transformArticlesByLocale(articles, locale);
    const finalArticles = transformedArticles.map((article: any) => ({
      ...article,
      category: article.category ? transformCategoryByLocale(article.category, locale) : article.category,
      author: article.author ? transformAuthorByLocale(article.author, locale) : article.author
    }));

    return createSuccessResponse({
      articles: finalArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
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
    const { blogArticleSchema, sanitizeObject } = await import('@/lib/validation');
    
    const validatedData = blogArticleSchema.parse(body);
    const sanitizedData = sanitizeObject(validatedData);

    const article = await prisma.blogArticle.create({
      data: sanitizedData,
      include: {
        author: true,
        category: true
      }
    });

    return createSuccessResponse({ article }, 'Article created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

