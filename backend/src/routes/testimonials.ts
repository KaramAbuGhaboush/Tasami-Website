import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: active
 *         description: Filter by testimonial status
 *     responses:
 *       200:
 *         description: List of testimonials
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
 *                     testimonials:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           clientName:
 *                             type: string
 *                           clientCompany:
 *                             type: string
 *                           clientPosition:
 *                             type: string
 *                           clientAvatar:
 *                             type: string
 *                           content:
 *                             type: string
 *                           rating:
 *                             type: integer
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
    const { featured, status = 'active' } = req.query;
    
    const where: any = { status };
    if (featured !== undefined) where.featured = featured === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Transform the response to match the desired format
    const transformedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id,
      clientName: testimonial.name,
      clientCompany: testimonial.company,
      clientPosition: testimonial.role,
      clientAvatar: testimonial.initials || '',
      content: testimonial.quote,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt
    }));

    res.json({
      success: true,
      data: { testimonials: transformedTestimonials }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Get a single testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial details
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
 *                     testimonial:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         clientName:
 *                           type: string
 *                         clientCompany:
 *                           type: string
 *                         clientPosition:
 *                           type: string
 *                         clientAvatar:
 *                           type: string
 *                         content:
 *                           type: string
 *                         rating:
 *                           type: integer
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Testimonial not found
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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }

    // Transform the response to match the desired format
    const transformedTestimonial = {
      id: testimonial.id,
      clientName: testimonial.name,
      clientCompany: testimonial.company,
      clientPosition: testimonial.role,
      clientAvatar: testimonial.initials || '',
      content: testimonial.quote,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt
    };

    res.json({
      success: true,
      data: { testimonial: transformedTestimonial }
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create testimonial (admin)
router.post('/', async (req, res) => {
  try {
    const testimonialData = req.body;
    
    // Validate required fields
    if (!testimonialData.name || !testimonialData.quote) {
      res.status(400).json({
        success: false,
        message: 'Name and quote are required'
      });
      return;
    }

    // Generate initials from name
    const initials = testimonialData.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

    const testimonial = await prisma.testimonial.create({
      data: {
        name: testimonialData.name,
        role: testimonialData.role || '',
        company: testimonialData.company || '',
        quote: testimonialData.quote,
        rating: testimonialData.rating || 5,
        initials: testimonialData.initials || initials,
        featured: testimonialData.featured || false,
        status: testimonialData.status || 'active'
      }
    });

    res.status(201).json({
      success: true,
      data: { testimonial }
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update testimonial (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialData = req.body;
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }

    // Generate initials if name changed
    let initials = existingTestimonial.initials;
    if (testimonialData.name && testimonialData.name !== existingTestimonial.name) {
      initials = testimonialData.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: testimonialData.name || existingTestimonial.name,
        role: testimonialData.role || existingTestimonial.role,
        company: testimonialData.company || existingTestimonial.company,
        quote: testimonialData.quote || existingTestimonial.quote,
        rating: testimonialData.rating !== undefined ? testimonialData.rating : existingTestimonial.rating,
        initials: testimonialData.initials || initials,
        featured: testimonialData.featured !== undefined ? testimonialData.featured : existingTestimonial.featured,
        status: testimonialData.status || existingTestimonial.status
      }
    });

    res.json({
      success: true,
      data: { testimonial: updatedTestimonial }
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete testimonial (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
      return;
    }

    // Delete the testimonial
    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
