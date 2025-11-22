import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * POST /api/projects/[id]/content-blocks - Create content block (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id: projectId } = await params;
    const body = await request.json();

    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Create content block
    const contentBlock = await prisma.contentBlock.create({
      data: {
        projectId,
        type: body.type,
        order: body.order ?? 0,
        content: body.content || null,
        contentAr: body.contentAr || null,
        src: body.src || null,
        alt: body.alt || null,
        altAr: body.altAr || null,
        width: body.width || null,
        height: body.height || null,
        caption: body.caption || null,
        captionAr: body.captionAr || null,
        level: body.level || null,
        columns: body.columns || null,
        images: body.images || null, // Prisma handles JSON automatically
      },
    });

    // Revalidate project pages
    revalidatePath(`/en/projects/${projectId}`, 'page');
    revalidatePath(`/ar/projects/${projectId}`, 'page');
    revalidateTag(`project-${projectId}`);
    revalidateTag('projects');

    return createSuccessResponse({ contentBlock }, 'Content block created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

