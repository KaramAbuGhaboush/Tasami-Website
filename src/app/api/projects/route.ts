import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { ProjectService } from '@/services/projectService';

/**
 * GET /api/projects - Get all projects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';

    const result = await ProjectService.getProjects({
      category: category || undefined,
      locale,
    });

    const response = createSuccessResponse(result);
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/projects - Create project (admin only)
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

    const project = await ProjectService.createProject(sanitizedData);

    return createSuccessResponse({ project }, 'Project created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

