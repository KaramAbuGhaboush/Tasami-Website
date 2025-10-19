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
 *                         $ref: '#/components/schemas/ContactMessage'
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
 *               phone:
 *                 type: string
 *                 description: Contact person's phone number
 *                 example: "+1234567890"
 *               company:
 *                 type: string
 *                 description: Company name
 *                 example: "Acme Corp"
 *               subject:
 *                 type: string
 *                 description: Message subject
 *                 example: "Project Inquiry"
 *               message:
 *                 type: string
 *                 description: Message content
 *                 example: "I'm interested in your services"
 *               service:
 *                 type: string
 *                 description: Service of interest
 *                 example: "Web Development"
 *               budget:
 *                 type: string
 *                 description: Project budget range
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       $ref: '#/components/schemas/ContactMessage'
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
      phone,
      company,
      subject,
      message,
      service,
      budget
    } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        company,
        subject,
        message,
        service,
        budget,
        status: 'new',
        priority: 'unchecked',
        source: 'website'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { contactMessage }
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update contact message (admin)
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
        status: messageData.status || existingMessage.status,
        priority: messageData.priority || existingMessage.priority,
        assignedTo: messageData.assignedTo || existingMessage.assignedTo,
        notes: messageData.notes || existingMessage.notes
      }
    });

    return res.json({
      success: true,
      data: { message: updatedMessage }
    });
  } catch (error) {
    console.error('Update contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete contact message (admin)
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