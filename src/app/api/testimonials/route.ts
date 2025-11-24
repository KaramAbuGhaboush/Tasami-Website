import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { testimonialSchema } from '@/lib/validation';

/**
 * GET /api/testimonials - Get all testimonials
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'active';

    const where: any = { status };
    if (featured !== undefined) where.featured = featured === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return createSuccessResponse({ testimonials });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/testimonials - Create testimonial (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: validatedData
    });

    return createSuccessResponse({ testimonial }, 'Testimonial created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

