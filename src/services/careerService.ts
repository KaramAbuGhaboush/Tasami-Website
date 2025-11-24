/**
 * Career Service Layer
 * Handles all career/job-related business logic
 */

import { prisma } from '@/lib/prisma'
import { jobSchema } from '@/lib/validation'
import { z } from 'zod'
import { transformJobsByLocale, normalizeLocale } from '@/server/utils/localization'

export interface GetJobsParams {
  page?: number
  limit?: number
  department?: string
  location?: string
  type?: string
  locale?: string
}

export interface CreateJobData extends z.infer<typeof jobSchema> {}

export interface UpdateJobData extends Partial<CreateJobData> {}

export class CareerService {
  /**
   * Get all jobs with pagination and filters
   */
  static async getJobs(params: GetJobsParams = {}) {
    const {
      page = 1,
      limit = 10,
      department,
      location,
      type,
      locale = 'en',
    } = params

    const skip = (page - 1) * limit
    const normalizedLocale = normalizeLocale(locale)

    const where: any = { status: 'active' }
    if (department) where.department = department
    if (location) where.location = location
    if (type) where.type = type

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          titleAr: true,
          department: true,
          departmentAr: true,
          location: true,
          locationAr: true,
          type: true,
          typeAr: true,
          experience: true,
          experienceAr: true,
          description: true,
          descriptionAr: true,
          requirements: true,
          requirementsAr: true,
          benefits: true,
          benefitsAr: true,
          status: true,
          postedDate: true,
          applicationDeadline: true,
          applications: true,
          salary: true,
          salaryAr: true,
          team: true,
          teamAr: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { postedDate: 'desc' },
      }),
      prisma.job.count({ where }),
    ])

    const transformedJobs = transformJobsByLocale(jobs, normalizedLocale)

    return {
      jobs: transformedJobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get job by ID
   */
  static async getJobById(id: string, locale: string = 'en') {
    const normalizedLocale = normalizeLocale(locale)

    const job = await prisma.job.findUnique({
      where: { id },
    })

    if (!job) {
      return null
    }

    const transformedJobs = transformJobsByLocale([job], normalizedLocale)
    return transformedJobs[0]
  }

  /**
   * Create job
   */
  static async createJob(data: CreateJobData) {
    const validatedData = jobSchema.parse(data)
    
    // Convert empty applicationDeadline string to null for Prisma
    const jobData = {
      ...validatedData,
      applicationDeadline: validatedData.applicationDeadline && validatedData.applicationDeadline.trim() !== '' 
        ? validatedData.applicationDeadline 
        : null,
    }
    
    const job = await prisma.job.create({
      data: jobData,
    })

    return job
  }

  /**
   * Update job
   */
  static async updateJob(id: string, data: UpdateJobData) {
    const validatedData = jobSchema.partial().parse(data)
    
    // Convert empty applicationDeadline string to null for Prisma
    const jobData = {
      ...validatedData,
      applicationDeadline: validatedData.applicationDeadline !== undefined 
        ? (validatedData.applicationDeadline && validatedData.applicationDeadline.trim() !== '' 
          ? validatedData.applicationDeadline 
          : null)
        : undefined,
    }
    
    const job = await prisma.job.update({
      where: { id },
      data: jobData,
    })

    return job
  }

  /**
   * Delete job
   */
  static async deleteJob(id: string) {
    await prisma.job.delete({
      where: { id },
    })

    return { success: true }
  }
}

