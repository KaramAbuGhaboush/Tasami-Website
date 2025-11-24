import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { testimonialSchema } from '@/lib/validation';

/**
 * GET /api/testimonials/[id] - Get testimonial by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return createErrorResponse('Testimonial not found', 404);
    }

    return createSuccessResponse({ testimonial });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/testimonials/[id] - Update testimonial (admin only)
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
    const validatedData = testimonialSchema.partial().parse(body);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: validatedData
    });

    return createSuccessResponse({ testimonial }, 'Testimonial updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/testimonials/[id] - Delete testimonial (admin only)
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

    await prisma.testimonial.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Testimonial deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

