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
        category: true,
        clientTestimonial: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Transform the response to match the desired format
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      headerImage: project.headerImage,
      challenge: project.challenge,
      solution: project.solution,
      timeline: project.timeline,
      teamSize: project.teamSize,
      status: project.status,
      category: project.category,
      technologies: project.technologies,
      results: project.results,
      clientTestimonial: project.clientTestimonial,
      contentBlocks: project.contentBlocks || [],
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
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               headerImage:
 *                 type: string
 *                 description: Project header image URL
 *               challenge:
 *                 type: string
 *                 description: Project challenge
 *               solution:
 *                 type: string
 *                 description: Project solution
 *               timeline:
 *                 type: string
 *                 description: Project timeline
 *               teamSize:
 *                 type: string
 *                 description: Team size
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed, on-hold]
 *                 default: planning
 *               categoryId:
 *                 type: string
 *                 description: Project category ID
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     metric:
 *                       type: string
 *                     description:
 *                       type: string
 *               testimonial:
 *                 type: object
 *                 properties:
 *                   quote:
 *                     type: string
 *                   author:
 *                     type: string
 *                   position:
 *                     type: string
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                         headerImage:
 *                           type: string
 *                         challenge:
 *                           type: string
 *                         solution:
 *                           type: string
 *                         timeline:
 *                           type: string
 *                         teamSize:
 *                           type: string
 *                         status:
 *                           type: string
 *                         categoryId:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: object
 *                         results:
 *                           type: array
 *                           items:
 *                             type: object
 *                         testimonial:
 *                           type: object
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
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
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      headerImage,
      challenge,
      solution,
      timeline,
      teamSize,
      status = 'planning',
      categoryId,
      technologies = [],
      results = [],
      testimonial
    } = req.body;

    // Validate required fields
    if (!title || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and categoryId are required'
      });
    }

    // Check if category exists
    const category = await prisma.projectCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Create project with related data
    const project = await prisma.project.create({
      data: {
        title,
        description,
        headerImage: headerImage || null,
        challenge: challenge || null,
        solution: solution || null,
        timeline: timeline || null,
        teamSize: teamSize || null,
        status,
        categoryId,
        technologies: {
          create: technologies.map((tech: any) => ({
            name: tech.name,
            description: tech.description
          }))
        },
        results: {
          create: results.map((result: any) => ({
            metric: result.metric,
            description: result.description
          }))
        },
        ...(testimonial && {
          clientTestimonial: {
            create: {
              quote: testimonial.quote,
              author: testimonial.author,
              position: testimonial.position
            }
          }
        })
      },
      include: {
        technologies: true,
        results: true,
        clientTestimonial: true,
        category: true
      }
    });

    return res.status(201).json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               headerImage:
 *                 type: string
 *                 description: Project header image URL
 *               challenge:
 *                 type: string
 *                 description: Project challenge
 *               solution:
 *                 type: string
 *                 description: Project solution
 *               timeline:
 *                 type: string
 *                 description: Project timeline
 *               teamSize:
 *                 type: string
 *                 description: Team size
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed, on-hold]
 *               categoryId:
 *                 type: string
 *                 description: Project category ID
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     metric:
 *                       type: string
 *                     description:
 *                       type: string
 *               testimonial:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   quote:
 *                     type: string
 *                   author:
 *                     type: string
 *                   position:
 *                     type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                         headerImage:
 *                           type: string
 *                         challenge:
 *                           type: string
 *                         solution:
 *                           type: string
 *                         timeline:
 *                           type: string
 *                         teamSize:
 *                           type: string
 *                         status:
 *                           type: string
 *                         categoryId:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: object
 *                         results:
 *                           type: array
 *                           items:
 *                             type: object
 *                         testimonial:
 *                           type: object
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // If categoryId is provided, check if category exists
    if (updateData.categoryId) {
      const category = await prisma.projectCategory.findUnique({
        where: { id: updateData.categoryId }
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Update project with related data
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: updateData.title,
        description: updateData.description,
        headerImage: updateData.headerImage,
        challenge: updateData.challenge,
        solution: updateData.solution,
        timeline: updateData.timeline,
        teamSize: updateData.teamSize,
        status: updateData.status,
        categoryId: updateData.categoryId,
        ...(updateData.technologies && {
          technologies: {
            deleteMany: {},
            create: updateData.technologies.map((tech: any) => ({
              name: tech.name,
              description: tech.description
            }))
          }
        }),
        ...(updateData.results && {
          results: {
            deleteMany: {},
            create: updateData.results.map((result: any) => ({
              metric: result.metric,
              description: result.description
            }))
          }
        }),
        ...(updateData.testimonial && {
          clientTestimonial: {
            upsert: {
              create: {
                quote: updateData.testimonial.quote,
                author: updateData.testimonial.author,
                position: updateData.testimonial.position
              },
              update: {
                quote: updateData.testimonial.quote,
                author: updateData.testimonial.author,
                position: updateData.testimonial.position
              }
            }
          }
        })
      },
      include: {
        technologies: true,
        results: true,
        clientTestimonial: true,
        category: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Update project error:', error);
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
 *                         contentBlocks:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                                 enum: [heading, paragraph, image, imageGrid]
 *                               order:
 *                                 type: integer
 *                               content:
 *                                 type: string
 *                               src:
 *                                 type: string
 *                               alt:
 *                                 type: string
 *                               width:
 *                                 type: integer
 *                               height:
 *                                 type: integer
 *                               caption:
 *                                 type: string
 *                               level:
 *                                 type: integer
 *                               columns:
 *                                 type: integer
 *                               images:
 *                                 type: array
 *                                 items:
 *                                   type: object
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
        category: true,
        clientTestimonial: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        }
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
      headerImage: project.headerImage,
      challenge: project.challenge,
      solution: project.solution,
      timeline: project.timeline,
      teamSize: project.teamSize,
      status: project.status,
      category: project.category,
      technologies: project.technologies,
      results: project.results,
      contentBlocks: project.contentBlocks,
      clientTestimonial: project.clientTestimonial,
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

/**
 * @swagger
 * /projects/{id}/content-blocks:
 *   post:
 *     summary: Create a new content block for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - order
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [heading, paragraph, image, imageGrid]
 *               order:
 *                 type: integer
 *               content:
 *                 type: string
 *               src:
 *                 type: string
 *               alt:
 *                 type: string
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               caption:
 *                 type: string
 *               level:
 *                 type: integer
 *               columns:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Content block created successfully
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
 *                     contentBlock:
 *                       type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/content-blocks', async (req, res) => {
  try {
    const { id } = req.params;
    const contentBlockData = req.body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Create content block
    const contentBlock = await prisma.contentBlock.create({
      data: {
        ...contentBlockData,
        projectId: id
      }
    });

    return res.status(201).json({
      success: true,
      data: { contentBlock }
    });
  } catch (error) {
    console.error('Create content block error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /projects/{id}/content-blocks/reorder:
 *   put:
 *     summary: Reorder content blocks for a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Content blocks reordered successfully
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
 *                   example: Content blocks reordered successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/content-blocks/reorder', async (req, res) => {
  try {
    const { id } = req.params;
    const { blocks } = req.body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Validate that all blocks exist and belong to this project
    const blockIds = blocks.map((b: any) => b.id);
    const existingBlocks = await prisma.contentBlock.findMany({
      where: {
        id: { in: blockIds },
        projectId: id
      }
    });

    if (existingBlocks.length !== blocks.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more content blocks not found'
      });
    }

    // Update order for each block
    for (const block of blocks) {
      await prisma.contentBlock.update({
        where: { id: block.id },
        data: { order: block.order }
      });
    }

    return res.json({
      success: true,
      message: 'Content blocks reordered successfully'
    });
  } catch (error) {
    console.error('Reorder content blocks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /projects/{id}/content-blocks/{blockId}:
 *   put:
 *     summary: Update a content block
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content Block ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [heading, paragraph, image, imageGrid]
 *               order:
 *                 type: integer
 *               content:
 *                 type: string
 *               src:
 *                 type: string
 *               alt:
 *                 type: string
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               caption:
 *                 type: string
 *               level:
 *                 type: integer
 *               columns:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Content block updated successfully
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
 *                     contentBlock:
 *                       type: object
 *       404:
 *         description: Content block not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/content-blocks/:blockId', async (req, res) => {
  try {
    const { id, blockId } = req.params;
    const updateData = req.body;

    // Check if content block exists and belongs to project
    const existingBlock = await prisma.contentBlock.findFirst({
      where: {
        id: blockId,
        projectId: id
      }
    });

    if (!existingBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    // Update content block
    const contentBlock = await prisma.contentBlock.update({
      where: { id: blockId },
      data: updateData
    });

    return res.json({
      success: true,
      data: { contentBlock }
    });
  } catch (error) {
    console.error('Update content block error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /projects/{id}/content-blocks/{blockId}:
 *   delete:
 *     summary: Delete a content block
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content Block ID
 *     responses:
 *       200:
 *         description: Content block deleted successfully
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
 *                   example: Content block deleted successfully
 *       404:
 *         description: Content block not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id/content-blocks/:blockId', async (req, res) => {
  try {
    const { id, blockId } = req.params;

    // Check if content block exists and belongs to project
    const existingBlock = await prisma.contentBlock.findFirst({
      where: {
        id: blockId,
        projectId: id
      }
    });

    if (!existingBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    // Delete content block
    await prisma.contentBlock.delete({
      where: { id: blockId }
    });

    return res.json({
      success: true,
      message: 'Content block deleted successfully'
    });
  } catch (error) {
    console.error('Delete content block error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Debug endpoint to check content blocks
router.get('/:id/debug-content-blocks', async (req, res) => {
  try {
    const { id } = req.params;
    
    const allBlocks = await prisma.contentBlock.findMany({
      where: { projectId: id }
    });
    
    return res.json({
      success: true,
      data: {
        projectId: id,
        totalBlocks: allBlocks.length,
        blocks: allBlocks.map(b => ({
          id: b.id,
          type: b.type,
          order: b.order,
          projectId: b.projectId
        }))
      }
    });
  } catch (error) {
    console.error('Debug content blocks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Test reorder endpoint
router.put('/:id/test-reorder', async (req, res) => {
  try {
    const { id } = req.params;
    const { blocks } = req.body;

    console.log('Test reorder request:', { projectId: id, blocks });

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Test the query step by step
    const blockIds = blocks.map((b: any) => b.id);
    console.log('Looking for block IDs:', blockIds);

    const existingBlocks = await prisma.contentBlock.findMany({
      where: {
        id: { in: blockIds },
        projectId: id
      }
    });

    console.log('Found blocks:', existingBlocks.length);
    console.log('Found block IDs:', existingBlocks.map(b => b.id));

    if (existingBlocks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No content blocks found',
        debug: {
          requestedIds: blockIds,
          projectId: id,
          foundBlocks: existingBlocks.length
        }
      });
    }

    return res.json({
      success: true,
      message: 'Test successful',
      debug: {
        requestedIds: blockIds,
        projectId: id,
        foundBlocks: existingBlocks.length,
        foundBlockIds: existingBlocks.map(b => b.id)
      }
    });
  } catch (error) {
    console.error('Test reorder error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;