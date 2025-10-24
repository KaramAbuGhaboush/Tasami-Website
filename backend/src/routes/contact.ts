import express from 'express';
import { PrismaClient } from '@prisma/client';
import EmailService from '../services/emailService';

const router = express.Router();
const prisma = new PrismaClient();
const emailService = new EmailService();

/**
 * @swagger
 * /contact/messages:
 *   get:
 *     summary: Get all contact messages (Admin)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of messages per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied, closed]
 *         description: Filter by message status
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Filter by service type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, company, or message
 *     responses:
 *       200:
 *         description: List of contact messages
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
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "cmgzjs9c30000rvdcta7cgkks"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *                           company:
 *                             type: string
 *                             example: "Test Corp"
 *                           message:
 *                             type: string
 *                             example: "I need a new website for my business"
 *                           service:
 *                             type: string
 *                             example: "Web Development"
 *                           budget:
 *                             type: string
 *                             example: "$10,000 - $25,000"
 *                           status:
 *                             type: string
 *                             example: "new"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-20T19:47:54.813Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-20T19:47:54.813Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         pages:
 *                           type: integer
 *                           example: 3
 *       401:
 *         description: Unauthorized
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
router.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const status = req.query.status as string;
    const service = req.query.service as string;
    const search = req.query.search as string;
    
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (service) {
      where.service = service;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
        { message: { contains: search } }
      ];
    }
    
    // Get total count for pagination
    const total = await prisma.contactMessage.count({ where });
    
    // Get paginated messages
    const messages = await prisma.contactMessage.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        service: true,
        budget: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const pages = Math.ceil(total / limit);

    return res.json({
      success: true,
      data: { 
        messages,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /contact/messages:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *               - service
 *               - budget
 *             properties:
 *               name:
 *                 type: string
 *                 description: Contact person's name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact person's email
 *                 example: "john@example.com"
 *               company:
 *                 type: string
 *                 description: Company name
 *                 example: "Acme Corp"
 *               message:
 *                 type: string
 *                 description: Message content
 *                 example: "I'm interested in your services"
 *               service:
 *                 type: string
 *                 description: Service of interest (required)
 *                 example: "Web Development"
 *               budget:
 *                 type: string
 *                 description: Project budget range (required)
 *                 example: "$10,000 - $50,000"
 *     responses:
 *       201:
 *         description: Message submitted successfully
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
 *                   example: "Message sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     contactMessage:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "cmgzk0v1d0000rvga9pjnp4le"
 *                         name:
 *                           type: string
 *                           example: "Jane Smith"
 *                         email:
 *                           type: string
 *                           example: "jane@example.com"
 *                         company:
 *                           type: string
 *                           example: "Tech Corp"
 *                         message:
 *                           type: string
 *                           example: "I need a mobile app for my business"
 *                         service:
 *                           type: string
 *                           example: "Mobile App Development"
 *                         budget:
 *                           type: string
 *                           example: "$25,000 - $50,000"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-20T19:54:36.192Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-20T19:54:36.192Z"
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
router.post('/messages', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      message,
      service,
      budget
    } = req.body;

    // Validate required fields (matching form requirements)
    if (!name || !email || !message || !service || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, message, service, and budget are required'
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        message,
        service,
        budget,
        status: 'new',
        source: 'website'
      }
    });

    // Return only specified fields
    const responseMessage = {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      company: contactMessage.company,
      message: contactMessage.message,
      service: contactMessage.service,
      budget: contactMessage.budget,
      createdAt: contactMessage.createdAt,
      updatedAt: contactMessage.updatedAt
    };

    // Send response to client first
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { contactMessage: responseMessage }
    });

    // Send email notification to admins in background (after response)
    setImmediate(async () => {
      try {
        await emailService.sendContactNotification({
          name: contactMessage.name,
          email: contactMessage.email,
          company: contactMessage.company || '',
          message: contactMessage.message,
          service: contactMessage.service,
          budget: contactMessage.budget,
          createdAt: contactMessage.createdAt
        });
        console.log('Contact notification email sent successfully');
      } catch (emailError) {
        // Log email error but don't fail the contact form submission
        console.error('Failed to send contact notification email:', emailError);
      }
    });

    return; // Explicit return after sending response
  } catch (error) {
    console.error('Submit contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /contact/messages/{id}:
 *   put:
 *     summary: Update a contact message (Admin)
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Message status
 *                 example: "read"
 *                 enum: ["new", "read", "replied", "closed"]
 *     responses:
 *       200:
 *         description: Message updated successfully
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
 *                     message:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "cmgzk0v1d0000rvga9pjnp4le"
 *                         name:
 *                           type: string
 *                           example: "Jane Smith"
 *                         email:
 *                           type: string
 *                           example: "jane@example.com"
 *                         company:
 *                           type: string
 *                           example: "Tech Corp"
 *                         message:
 *                           type: string
 *                           example: "I need a mobile app for my business"
 *                         service:
 *                           type: string
 *                           example: "Mobile App Development"
 *                         budget:
 *                           type: string
 *                           example: "$25,000 - $50,000"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-20T19:54:36.192Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-20T19:54:41.202Z"
 *       404:
 *         description: Message not found
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
router.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const messageData = req.body;
    
    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: messageData.status || existingMessage.status
      }
    });

    // Return only specified fields
    const responseMessage = {
      id: updatedMessage.id,
      name: updatedMessage.name,
      email: updatedMessage.email,
      company: updatedMessage.company,
      message: updatedMessage.message,
      service: updatedMessage.service,
      budget: updatedMessage.budget,
      createdAt: updatedMessage.createdAt,
      updatedAt: updatedMessage.updatedAt
    };

    return res.json({
      success: true,
      data: { message: responseMessage }
    });
  } catch (error) {
    console.error('Update contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /contact/messages/{id}:
 *   delete:
 *     summary: Delete a contact message (Admin)
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
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
 *                   example: "Message deleted successfully"
 *       404:
 *         description: Message not found
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
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Delete the message
    await prisma.contactMessage.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /contact/test-email:
 *   post:
 *     summary: Test email configuration (Admin)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email test successful
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
 *                   example: "Email configuration test successful"
 *       500:
 *         description: Email test failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/test-email', async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();
    
    if (isConnected) {
      return res.json({
        success: true,
        message: 'Email configuration test successful'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email configuration test failed'
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Email test failed: ' + (error as Error).message
    });
  }
});

export default router;