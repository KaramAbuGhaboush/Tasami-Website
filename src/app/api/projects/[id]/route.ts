import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import {
  normalizeLocale,
  transformProjectByLocale,
  transformProjectCategoryByLocale,
  transformProjectTechnologyByLocale,
  transformProjectResultByLocale,
  transformProjectTestimonialByLocale,
  transformContentBlockByLocale,
} from '@/server/utils/localization';

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
    const locale = normalizeLocale(searchParams.get('locale'));

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Transform based on locale
    const transformedProject = transformProjectByLocale(project, locale);
    transformedProject.category = project.category 
      ? transformProjectCategoryByLocale(project.category, locale) 
      : project.category;
    transformedProject.technologies = project.technologies.map((tech: any) =>
      transformProjectTechnologyByLocale(tech, locale)
    );
    transformedProject.results = project.results.map((result: any) =>
      transformProjectResultByLocale(result, locale)
    );
    if (project.clientTestimonial) {
      transformedProject.clientTestimonial = transformProjectTestimonialByLocale(project.clientTestimonial, locale);
    }
    transformedProject.contentBlocks = project.contentBlocks.map((block: any) =>
      transformContentBlockByLocale(block, locale)
    );

    return createSuccessResponse({ project: transformedProject });
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
    
    // Extract nested relations
    const { technologies, results, testimonial, ...projectData } = body;
    const sanitizedProjectData = sanitizeObject(projectData);

    // Build update data with proper nested relation handling
    const updateData: any = { ...sanitizedProjectData };

    // Handle technologies: delete all existing and create new ones
    if (technologies !== undefined) {
      updateData.technologies = {
        deleteMany: {},
        create: Array.isArray(technologies) ? technologies.map((tech: any) => ({
          name: tech.name,
          nameAr: tech.nameAr || null,
          description: tech.description,
          descriptionAr: tech.descriptionAr || null,
        })) : []
      };
    }

    // Handle results: delete all existing and create new ones
    if (results !== undefined) {
      updateData.results = {
        deleteMany: {},
        create: Array.isArray(results) ? results.map((result: any) => ({
          metric: result.metric,
          metricAr: result.metricAr || null,
          description: result.description,
          descriptionAr: result.descriptionAr || null,
        })) : []
      };
    }

    // Handle testimonial: upsert (update or create)
    if (testimonial !== undefined) {
      if (testimonial === null) {
        // Delete testimonial if null
        updateData.clientTestimonial = { delete: true };
      } else {
        updateData.clientTestimonial = {
          upsert: {
            create: {
              quote: testimonial.quote,
              quoteAr: testimonial.quoteAr || null,
              author: testimonial.author,
              authorAr: testimonial.authorAr || null,
              position: testimonial.position,
              positionAr: testimonial.positionAr || null,
            },
            update: {
              quote: testimonial.quote,
              quoteAr: testimonial.quoteAr || null,
              author: testimonial.author,
              authorAr: testimonial.authorAr || null,
              position: testimonial.position,
              positionAr: testimonial.positionAr || null,
            }
          }
        };
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true
      }
    });

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

    await prisma.project.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Project deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

