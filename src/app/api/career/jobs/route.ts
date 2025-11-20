import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { paginationSchema } from '@/lib/validation';
import { normalizeLocale, transformJobsByLocale } from '@/server/utils/localization';

/**
 * GET /api/career/jobs - Get all jobs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const department = searchParams.get('department');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const locale = normalizeLocale(searchParams.get('locale'));

    const skip = (page - 1) * limit;

    const where: any = { status: 'active' };
    if (department) where.department = department;
    if (location) where.location = location;
    if (type) where.type = type;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedDate: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    const transformedJobs = transformJobsByLocale(jobs, locale);

    return createSuccessResponse({
      jobs: transformedJobs,
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
 * POST /api/career/jobs - Create job (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const body = await request.json();
    const { jobSchema, sanitizeObject } = await import('@/lib/validation');
    
    const validatedData = jobSchema.parse(body);
    const sanitizedData = sanitizeObject(validatedData);

    const job = await prisma.job.create({
      data: sanitizedData
    });

    return createSuccessResponse({ job }, 'Job created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

