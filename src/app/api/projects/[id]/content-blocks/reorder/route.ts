import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * PUT /api/projects/[id]/content-blocks/reorder - Reorder content blocks (admin only)
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

    const { id: projectId } = await params;
    const body = await request.json();
    const { blocks } = body;

    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Validate blocks array
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return createErrorResponse('Invalid blocks array', 400);
    }

    // Validate all blocks exist and belong to the project
    const blockIds = blocks.map(b => b.id);
    const existingBlocks = await prisma.contentBlock.findMany({
      where: {
        id: { in: blockIds },
        projectId: projectId,
      },
    });

    if (existingBlocks.length !== blockIds.length) {
      return createErrorResponse('One or more content blocks not found', 404);
    }

    // Update order for each block
    const updatePromises = blocks.map(({ id, order }) =>
      prisma.contentBlock.update({
        where: { id },
        data: { order },
      })
    );

    await Promise.all(updatePromises);

    // Fetch updated blocks
    const updatedBlocks = await prisma.contentBlock.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Revalidate project pages
    revalidatePath(`/en/projects/${projectId}`, 'page');
    revalidatePath(`/ar/projects/${projectId}`, 'page');
    revalidateTag(`project-${projectId}`);
    revalidateTag('projects');

    return createSuccessResponse(
      { contentBlocks: updatedBlocks },
      'Content blocks reordered successfully'
    );
  } catch (error) {
    return handleError(error);
  }
}

