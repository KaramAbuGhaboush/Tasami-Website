import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * PUT /api/projects/[id]/content-blocks/[blockId] - Update content block (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id: projectId, blockId } = await params;
    const body = await request.json();

    // Validate content block exists and belongs to project
    const existingBlock = await prisma.contentBlock.findFirst({
      where: {
        id: blockId,
        projectId: projectId,
      },
    });

    if (!existingBlock) {
      return createErrorResponse('Content block not found', 404);
    }

    // Update content block
    const contentBlock = await prisma.contentBlock.update({
      where: { id: blockId },
      data: {
        type: body.type ?? existingBlock.type,
        order: body.order ?? existingBlock.order,
        content: body.content !== undefined ? body.content : existingBlock.content,
        contentAr: body.contentAr !== undefined ? body.contentAr : existingBlock.contentAr,
        src: body.src !== undefined ? body.src : existingBlock.src,
        alt: body.alt !== undefined ? body.alt : existingBlock.alt,
        altAr: body.altAr !== undefined ? body.altAr : existingBlock.altAr,
        width: body.width !== undefined ? body.width : existingBlock.width,
        height: body.height !== undefined ? body.height : existingBlock.height,
        caption: body.caption !== undefined ? body.caption : existingBlock.caption,
        captionAr: body.captionAr !== undefined ? body.captionAr : existingBlock.captionAr,
        level: body.level !== undefined ? body.level : existingBlock.level,
        columns: body.columns !== undefined ? body.columns : existingBlock.columns,
        images: body.images !== undefined ? body.images : existingBlock.images, // Prisma handles JSON automatically
      },
    });

    // Revalidate project pages
    revalidatePath(`/en/projects/${projectId}`, 'page');
    revalidatePath(`/ar/projects/${projectId}`, 'page');
    revalidateTag(`project-${projectId}`);
    revalidateTag('projects');

    return createSuccessResponse({ contentBlock }, 'Content block updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/projects/[id]/content-blocks/[blockId] - Delete content block (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id: projectId, blockId } = await params;

    // Validate content block exists and belongs to project
    const existingBlock = await prisma.contentBlock.findFirst({
      where: {
        id: blockId,
        projectId: projectId,
      },
    });

    if (!existingBlock) {
      return createErrorResponse('Content block not found', 404);
    }

    // Delete content block
    await prisma.contentBlock.delete({
      where: { id: blockId },
    });

    // Revalidate project pages
    revalidatePath(`/en/projects/${projectId}`, 'page');
    revalidatePath(`/ar/projects/${projectId}`, 'page');
    revalidateTag(`project-${projectId}`);
    revalidateTag('projects');

    return createSuccessResponse(null, 'Content block deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

