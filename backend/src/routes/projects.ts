import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by project category
 *     responses:
 *       200:
 *         description: List of projects
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           image:
 *                             type: string
 *                           category:
 *                             type: string
 *                           status:
 *                             type: string
 *                           technologies:
 *                             type: array
 *                             items:
 *                               type: object
 *                           results:
 *                             type: array
 *                             items:
 *                               type: object
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const where: any = { status: 'active' };
    if (category) where.category = category;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        technologies: true,
        results: true,
        category: true
      }
    });

    // Transform the response to match the desired format
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.headerImage,
      category: project.category.name,
      status: project.status,
      technologies: project.technologies,
      results: project.results,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));

    return res.json({
      success: true,
      data: {
        projects: transformedProjects
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
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
 *                     project:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         image:
 *                           type: string
 *                         category:
 *                           type: string
 *                         status:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: object
 *                         results:
 *                           type: array
 *                           items:
 *                             type: object
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Project not found
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: true,
        results: true,
        category: true
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Transform the response to match the desired format
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.headerImage,
      category: project.category.name,
      status: project.status,
      technologies: project.technologies,
      results: project.results,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    return res.json({
      success: true,
      data: { project: transformedProject }
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;