import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { CareerService } from '@/services/careerService';

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
    const locale = searchParams.get('locale') || 'en';

    const result = await CareerService.getJobs({
        page,
        limit,
      department: department || undefined,
      location: location || undefined,
      type: type || undefined,
      locale,
    });

    const response = createSuccessResponse(result);

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    return response;
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
    const { sanitizeObject, jobSchema } = await import('@/lib/validation');
    
    const validatedData = jobSchema.parse(body);
    const sanitizedData = sanitizeObject(validatedData);

    // Convert empty applicationDeadline string to null for Prisma
    if (sanitizedData.applicationDeadline === '' || sanitizedData.applicationDeadline === undefined) {
      sanitizedData.applicationDeadline = null;
    }
    
    const job = await CareerService.createJob(sanitizedData);

    return createSuccessResponse({ job }, 'Job created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

