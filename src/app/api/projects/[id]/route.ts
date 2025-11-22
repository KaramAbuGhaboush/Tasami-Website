import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { ProjectService } from '@/services/projectService';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * GET /api/projects/[id] - Get project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const project = await ProjectService.getProjectById(id, locale);

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    const response = createSuccessResponse({ project });
    
    // Reduced cache time for faster updates (30 seconds instead of 5 minutes)
    // This allows updates to be visible much faster
    // Also add cache tags for revalidation
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    response.headers.set('Cache-Tag', `project-${id},projects`);

    return response;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/projects/[id] - Update project (admin only)
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
    const { sanitizeObject } = await import('@/lib/validation');
    
    const sanitizedData = sanitizeObject(body);
    const project = await ProjectService.updateProject(id, sanitizedData);

    // Revalidate the project pages and cache tags to clear cache
    // Revalidate all locale variants of the project page
    revalidatePath(`/en/projects/${id}`, 'page');
    revalidatePath(`/ar/projects/${id}`, 'page');
    revalidatePath('/projects', 'page'); // Also revalidate projects listing
    revalidateTag(`project-${id}`);
    revalidateTag('projects');

    return createSuccessResponse({ project }, 'Project updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/projects/[id] - Delete project (admin only)
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

    await ProjectService.deleteProject(id);

    // Revalidate paths after deletion
    revalidatePath('/en/projects', 'page');
    revalidatePath('/ar/projects', 'page');
    revalidatePath(`/en/projects/${id}`, 'page');
    revalidatePath(`/ar/projects/${id}`, 'page');
    revalidateTag(`project-${id}`);
    revalidateTag('projects');

    return createSuccessResponse(null, 'Project deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

