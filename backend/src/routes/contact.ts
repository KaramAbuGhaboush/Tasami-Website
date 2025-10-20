import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /contact/messages:
 *   get:
 *     summary: Get all contact messages (Admin)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
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
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-20T19:47:54.813Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-20T19:47:54.813Z"
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
    const messages = await prisma.contactMessage.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        service: true,
        budget: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: { messages }
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

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { contactMessage: responseMessage }
    });
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

export default router;