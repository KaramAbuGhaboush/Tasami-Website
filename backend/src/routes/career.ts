import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  transformJobByLocale,
  transformJobsByLocale,
  normalizeLocale
} from '../utils/localization';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /career/jobs:
 *   get:
 *     summary: Get all job positions
 *     tags: [Career]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of jobs per page
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by job type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by job status
 *     responses:
 *       200:
 *         description: List of job positions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/jobs', async (req, res) => {
  try {
    const { page = 1, limit = 10, department, location, type, status, locale } = req.query;
    const normalizedLocale = normalizeLocale(locale as string);
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // For admin requests, don't filter by status unless explicitly specified
    // For public requests, only show active jobs
    const where: any = {};
    if (status) {
      where.status = status;
    } else if (!req.headers.authorization) {
      // If no auth token, only show active jobs (public access)
      where.status = 'active';
    }
    
    // Build AND conditions with OR for localized fields
    const andConditions: any[] = [];
    
    // Filter by department (check both English and Arabic)
    if (department) {
      andConditions.push({
        OR: [
          { department: department },
          { departmentAr: department }
        ]
      });
    }
    
    // Filter by location (check both English and Arabic)
    if (location) {
      andConditions.push({
        OR: [
          { location: { contains: location } },
          { locationAr: { contains: location } }
        ]
      });
    }
    
    // Filter by type (check both English and Arabic)
    if (type) {
      andConditions.push({
        OR: [
          { type: type },
          { typeAr: type }
        ]
      });
    }
    
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    // Transform jobs based on locale
    const transformedJobs = transformJobsByLocale(jobs, normalizedLocale);

    return res.json({
      success: true,
      data: {
        jobs: transformedJobs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /career/jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { locale } = req.query;
    const normalizedLocale = normalizeLocale(locale as string);

    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Transform job based on locale
    const transformedJob = transformJobByLocale(job as any, normalizedLocale);

    return res.json({
      success: true,
      data: { job: transformedJob }
    });
  } catch (error) {
    console.error('Get job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /career/applications:
 *   post:
 *     summary: Submit a job application
 *     tags: [Career]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - applicantName
 *               - applicantEmail
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: Job ID
 *                 example: "cmgxuz4ao0000rvunc5togbmz"
 *               applicantName:
 *                 type: string
 *                 description: Applicant's full name
 *                 example: "John Doe"
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 description: Applicant's email
 *                 example: "john@example.com"
 *               applicantPhone:
 *                 type: string
 *                 description: Applicant's phone number
 *                 example: "+1234567890"
 *               applicantLocation:
 *                 type: string
 *                 description: Applicant's location
 *                 example: "New York, NY"
 *               resume:
 *                 type: string
 *                 description: Resume file path or URL
 *                 example: "/uploads/resume.pdf"
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter content
 *                 example: "I am excited to apply for this position..."
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/applications', async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantLocation,
      resume,
      coverLetter
    } = req.body;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // For now, we'll just return success
    // In a real app, you'd save the application to a database
    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /career/jobs:
 *   post:
 *     summary: Create a new job (Admin)
 *     tags: [Career]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - department
 *               - location
 *               - type
 *               - experience
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *                 example: "Senior Full Stack Developer"
 *               department:
 *                 type: string
 *                 description: Department
 *                 example: "Engineering"
 *               location:
 *                 type: string
 *                 description: Job location
 *                 example: "Remote"
 *               type:
 *                 type: string
 *                 description: Job type
 *                 example: "Full-time"
 *               experience:
 *                 type: string
 *                 description: Required experience
 *                 example: "5+ years"
 *               description:
 *                 type: string
 *                 description: Job description
 *                 example: "We are looking for a senior developer..."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job requirements
 *                 example: ["5+ years experience", "React knowledge", "Node.js experience"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job benefits
 *                 example: ["Health insurance", "Remote work", "Flexible hours"]
 *               salary:
 *                 type: string
 *                 description: Salary range
 *                 example: "$120,000 - $160,000"
 *               applicationDeadline:
 *                 type: string
 *                 format: date-time
 *                 description: Application deadline
 *                 example: "2024-12-31T23:59:59.000Z"
 *               status:
 *                 type: string
 *                 description: Job status
 *                 example: "active"
 *               team:
 *                 type: string
 *                 description: Team name
 *                 example: "Engineering Team"
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        titleAr: jobData.titleAr || null,
        department: jobData.department,
        departmentAr: jobData.departmentAr || null,
        location: jobData.location,
        locationAr: jobData.locationAr || null,
        type: jobData.type,
        typeAr: jobData.typeAr || null,
        experience: jobData.experience,
        experienceAr: jobData.experienceAr || null,
        description: jobData.description,
        descriptionAr: jobData.descriptionAr || null,
        requirements: jobData.requirements || [],
        requirementsAr: jobData.requirementsAr || null,
        benefits: jobData.benefits || [],
        benefitsAr: jobData.benefitsAr || null,
        status: jobData.status || 'active',
        postedDate: new Date(),
        salary: jobData.salary,
        salaryAr: jobData.salaryAr || null,
        team: jobData.team,
        teamAr: jobData.teamAr || null,
        applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null
      } as any
    });

    return res.status(201).json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /career/jobs/{id}:
 *   put:
 *     summary: Update a job (Admin)
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *                 example: "Senior Full Stack Developer"
 *               department:
 *                 type: string
 *                 description: Department
 *                 example: "Engineering"
 *               location:
 *                 type: string
 *                 description: Job location
 *                 example: "Remote"
 *               type:
 *                 type: string
 *                 description: Job type
 *                 example: "Full-time"
 *               experience:
 *                 type: string
 *                 description: Required experience
 *                 example: "5+ years"
 *               description:
 *                 type: string
 *                 description: Job description
 *                 example: "We are looking for a senior developer..."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job requirements
 *                 example: ["5+ years experience", "React knowledge", "Node.js experience"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job benefits
 *                 example: ["Health insurance", "Remote work", "Flexible hours"]
 *               salary:
 *                 type: string
 *                 description: Salary range
 *                 example: "$120,000 - $160,000"
 *               applicationDeadline:
 *                 type: string
 *                 format: date-time
 *                 description: Application deadline
 *                 example: "2024-12-31T23:59:59.000Z"
 *               status:
 *                 type: string
 *                 description: Job status
 *                 example: "active"
 *               team:
 *                 type: string
 *                 description: Team name
 *                 example: "Engineering Team"
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    
    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const existingJobWithAr = existingJob as any;
    
    const job = await prisma.job.update({
      where: { id },
      data: {
        title: jobData.title !== undefined ? jobData.title : existingJob.title,
        titleAr: jobData.titleAr !== undefined ? jobData.titleAr : existingJobWithAr.titleAr,
        department: jobData.department !== undefined ? jobData.department : existingJob.department,
        departmentAr: jobData.departmentAr !== undefined ? jobData.departmentAr : existingJobWithAr.departmentAr,
        location: jobData.location !== undefined ? jobData.location : existingJob.location,
        locationAr: jobData.locationAr !== undefined ? jobData.locationAr : existingJobWithAr.locationAr,
        type: jobData.type !== undefined ? jobData.type : existingJob.type,
        typeAr: jobData.typeAr !== undefined ? jobData.typeAr : existingJobWithAr.typeAr,
        experience: jobData.experience !== undefined ? jobData.experience : existingJob.experience,
        experienceAr: jobData.experienceAr !== undefined ? jobData.experienceAr : existingJobWithAr.experienceAr,
        description: jobData.description !== undefined ? jobData.description : existingJob.description,
        descriptionAr: jobData.descriptionAr !== undefined ? jobData.descriptionAr : existingJobWithAr.descriptionAr,
        requirements: jobData.requirements !== undefined ? jobData.requirements : existingJob.requirements,
        requirementsAr: jobData.requirementsAr !== undefined ? jobData.requirementsAr : existingJobWithAr.requirementsAr,
        benefits: jobData.benefits !== undefined ? jobData.benefits : existingJob.benefits,
        benefitsAr: jobData.benefitsAr !== undefined ? jobData.benefitsAr : existingJobWithAr.benefitsAr,
        status: jobData.status !== undefined ? jobData.status : existingJob.status,
        salary: jobData.salary !== undefined ? jobData.salary : existingJob.salary,
        salaryAr: jobData.salaryAr !== undefined ? jobData.salaryAr : existingJobWithAr.salaryAr,
        team: jobData.team !== undefined ? jobData.team : existingJob.team,
        teamAr: jobData.teamAr !== undefined ? jobData.teamAr : existingJobWithAr.teamAr,
        applicationDeadline: jobData.applicationDeadline !== undefined 
          ? (jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null)
          : existingJob.applicationDeadline
      } as any
    });

    return res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /career/jobs/{id}:
 *   delete:
 *     summary: Delete a job (Admin)
 *     tags: [Career]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Job deleted successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.job.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;