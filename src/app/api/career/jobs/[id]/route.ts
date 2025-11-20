import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { normalizeLocale, transformJobByLocale } from '@/server/utils/localization';

/**
 * GET /api/career/jobs/[id] - Get job by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = normalizeLocale(searchParams.get('locale'));

    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return createErrorResponse('Job not found', 404);
    }

    const transformedJob = transformJobByLocale(job, locale);

    return createSuccessResponse({ job: transformedJob });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/career/jobs/[id] - Update job (admin only)
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
    const { jobSchema, sanitizeObject } = await import('@/lib/validation');
    
    const validatedData = jobSchema.partial().parse(body);
    const sanitizedData = sanitizeObject(validatedData);

    const job = await prisma.job.update({
      where: { id },
      data: sanitizedData
    });

    return createSuccessResponse({ job }, 'Job updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/career/jobs/[id] - Delete job (admin only)
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

    await prisma.job.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Job deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

