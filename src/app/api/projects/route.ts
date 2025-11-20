import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import {
  normalizeLocale,
  transformProjectsByLocale,
  transformProjectCategoryByLocale,
} from '@/server/utils/localization';

/**
 * GET /api/projects - Get all projects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = normalizeLocale(searchParams.get('locale'));

    const where: any = {};
    if (category) {
      where.category = { slug: category };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform projects based on locale
    const transformedProjects = transformProjectsByLocale(projects, locale);
    const finalProjects = transformedProjects.map((project: any) => ({
      ...project,
      category: project.category ? transformProjectCategoryByLocale(project.category, locale) : project.category
    }));

    return createSuccessResponse({ projects: finalProjects });
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

    const project = await prisma.project.create({
      data: {
        ...sanitizedData,
        technologies: sanitizedData.technologies ? {
          create: sanitizedData.technologies
        } : undefined,
        results: sanitizedData.results ? {
          create: sanitizedData.results
        } : undefined,
        clientTestimonial: sanitizedData.clientTestimonial ? {
          create: sanitizedData.clientTestimonial
        } : undefined
      },
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true
      }
    });

    return createSuccessResponse({ project }, 'Project created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

