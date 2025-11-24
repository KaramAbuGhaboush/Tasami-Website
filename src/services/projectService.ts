/**
 * Project Service Layer
 * Handles all project-related business logic
 */

import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validation'
import { z } from 'zod'
import {
  transformProjectsByLocale,
  transformProjectCategoryByLocale,
  normalizeLocale,
} from '@/server/utils/localization'

export interface GetProjectsParams {
  category?: string
  locale?: string
}

export interface CreateProjectData extends z.infer<typeof projectSchema> {}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export class ProjectService {
  /**
   * Get all projects with optional category filter
   */
  static async getProjects(params: GetProjectsParams = {}) {
    const { category, locale = 'en' } = params
    const normalizedLocale = normalizeLocale(locale)

    const where: any = {}
    if (category) {
      where.category = { slug: category }
    }

    const projects = await prisma.project.findMany({
      where,
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        headerImage: true,
        challenge: true,
        challengeAr: true,
        solution: true,
        solutionAr: true,
        timeline: true,
        teamSize: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            description: true,
            descriptionAr: true,
          },
        },
        results: {
          select: {
            id: true,
            metric: true,
            metricAr: true,
            description: true,
            descriptionAr: true,
          },
        },
        clientTestimonial: {
          select: {
            id: true,
            quote: true,
            quoteAr: true,
            author: true,
            authorAr: true,
            position: true,
            positionAr: true,
          },
        },
        contentBlocks: {
          select: {
            id: true,
            type: true,
            order: true,
            content: true,
            contentAr: true,
            src: true,
            alt: true,
            altAr: true,
            width: true,
            height: true,
            caption: true,
            captionAr: true,
            level: true,
            columns: true,
            images: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform projects based on locale
    const transformedProjects = transformProjectsByLocale(projects, normalizedLocale)
    const finalProjects = transformedProjects.map((project: any) => ({
      ...project,
      category: project.category
        ? transformProjectCategoryByLocale(project.category, normalizedLocale)
        : project.category,
    }))

    return { projects: finalProjects }
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string, locale: string = 'en') {
    const normalizedLocale = normalizeLocale(locale)

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        titleAr: true,
        description: true,
        descriptionAr: true,
        headerImage: true,
        challenge: true,
        challengeAr: true,
        solution: true,
        solutionAr: true,
        timeline: true,
        teamSize: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            color: true,
            icon: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            description: true,
            descriptionAr: true,
          },
        },
        results: {
          select: {
            id: true,
            metric: true,
            metricAr: true,
            description: true,
            descriptionAr: true,
          },
        },
        clientTestimonial: {
          select: {
            id: true,
            quote: true,
            quoteAr: true,
            author: true,
            authorAr: true,
            position: true,
            positionAr: true,
          },
        },
        contentBlocks: {
          select: {
            id: true,
            type: true,
            order: true,
            content: true,
            contentAr: true,
            src: true,
            alt: true,
            altAr: true,
            width: true,
            height: true,
            caption: true,
            captionAr: true,
            level: true,
            columns: true,
            images: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!project) {
      return null
    }

    // Transform based on locale
    const transformedProject = transformProjectsByLocale([project], normalizedLocale)[0]
    transformedProject.category = project.category
      ? transformProjectCategoryByLocale(project.category, normalizedLocale)
      : project.category

    return transformedProject
  }

  /**
   * Create project
   */
  static async createProject(data: CreateProjectData) {
    const validatedData = projectSchema.parse(data)

    const { categoryId, technologies, results, testimonial, ...createData } = validatedData
    const createPayload: any = { ...createData }

    if (categoryId) {
      createPayload.category = {
        connect: { id: categoryId },
      }
    }

    if (technologies && technologies.length > 0) {
      createPayload.technologies = {
        create: technologies,
      }
    }

    if (results && results.length > 0) {
      createPayload.results = {
        create: results,
      }
    }

    if (testimonial) {
      createPayload.clientTestimonial = {
        create: testimonial,
      }
    }

    const project = await prisma.project.create({
      data: createPayload,
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
      },
    })

    return project
  }

  /**
   * Update project
   */
  static async updateProject(id: string, data: UpdateProjectData) {
    const validatedData = projectSchema.partial().parse(data)

    const { categoryId, technologies, results, testimonial, ...updateData } = validatedData
    const updatePayload: any = { ...updateData }

    if (categoryId) {
      updatePayload.category = {
        connect: { id: categoryId },
      }
    }

    // Handle technologies update
    if (technologies !== undefined) {
      // Delete existing and create new
      await prisma.projectTechnology.deleteMany({
        where: { projectId: id },
      })
      if (technologies.length > 0) {
        updatePayload.technologies = {
          create: technologies,
        }
      }
    }

    // Handle results update
    if (results !== undefined) {
      await prisma.projectResult.deleteMany({
        where: { projectId: id },
      })
      if (results.length > 0) {
        updatePayload.results = {
          create: results,
        }
      }
    }

    // Handle testimonial update
    if (testimonial !== undefined) {
      const existing = await prisma.projectTestimonial.findUnique({
        where: { projectId: id },
      })
      if (existing) {
        updatePayload.clientTestimonial = {
          update: testimonial,
        }
      } else if (Object.keys(testimonial).length > 0) {
        updatePayload.clientTestimonial = {
          create: testimonial,
        }
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updatePayload,
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
      },
    })

    return updatedProject
  }

  /**
   * Delete project
   */
  static async deleteProject(id: string) {
    await prisma.project.delete({
      where: { id },
    })

    return { success: true }
  }
}

