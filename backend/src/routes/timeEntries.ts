import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { startOfWeek, endOfWeek } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     TimeEntry:
 *       type: object
 *       required:
 *         - date
 *         - hours
 *         - minutes
 *         - project
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the time entry
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the time entry
 *         hours:
 *           type: integer
 *           description: Number of hours worked
 *         minutes:
 *           type: integer
 *           description: Number of minutes worked
 *         project:
 *           type: string
 *           description: Project name
 *         description:
 *           type: string
 *           description: Description of work done
 *         userId:
 *           type: string
 *           description: ID of the user who created the entry
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     WeeklySummary:
 *       type: object
 *       properties:
 *         totalHours:
 *           type: number
 *           description: Total hours worked this week
 *         goal:
 *           type: number
 *           description: Weekly goal (default 40 hours)
 *         remaining:
 *           type: number
 *           description: Hours remaining to reach goal
 *         progressPercentage:
 *           type: number
 *           description: Progress percentage towards goal
 */

/**
 * @swagger
 * /time-entries:
 *   post:
 *     summary: Create a new time entry
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - hours
 *               - minutes
 *               - project
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               hours:
 *                 type: integer
 *               minutes:
 *                 type: integer
 *               project:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, hours, minutes, project, description } = req.body;
    const userId = (req as any).user.id;

    // Validate required fields
    if (!date || hours === undefined || minutes === undefined || !project) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: date, hours, minutes, project'
      });
    }

    // Validate hours and minutes
    if (hours < 0 || minutes < 0 || minutes >= 60) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hours or minutes'
      });
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        date: new Date(date),
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        project,
        description,
        userId
      }
    });

    return res.status(201).json({
      success: true,
      data: timeEntry,
      message: 'Time entry created successfully'
    });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries:
 *   get:
 *     summary: Get user's time entries
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [today, week, all]
 *         description: Filter entries by time period
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
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Time entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TimeEntry'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { filter = 'all', page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = { userId };

    // Apply filters
    const now = new Date();
    switch (filter) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        whereClause.date = {
          gte: today,
          lt: tomorrow
        };
        break;
      case 'week':
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        whereClause.date = {
          gte: weekStart,
          lte: weekEnd
        };
        break;
      // 'all' doesn't need additional filtering
    }

    const [timeEntries, total] = await Promise.all([
      prisma.timeEntry.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.timeEntry.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        items: timeEntries,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries/{id}:
 *   put:
 *     summary: Update a time entry
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Time entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               hours:
 *                 type: integer
 *               minutes:
 *                 type: integer
 *               project:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Time entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Time entry not found
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, hours, minutes, project, description } = req.body;
    const userId = (req as any).user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Time entry ID is required'
      });
    }

    // Check if time entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id, userId }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    // Validate hours and minutes if provided
    if (hours !== undefined && (hours < 0 || minutes < 0 || minutes >= 60)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hours or minutes'
      });
    }

    const updateData: any = {};
    if (date) updateData.date = new Date(date);
    if (hours !== undefined) updateData.hours = parseInt(hours);
    if (minutes !== undefined) updateData.minutes = parseInt(minutes);
    if (project) updateData.project = project;
    if (description !== undefined) updateData.description = description;

    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data: updateData
    });

    return res.json({
      success: true,
      data: timeEntry,
      message: 'Time entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries/{id}:
 *   delete:
 *     summary: Delete a time entry
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Time entry ID
 *     responses:
 *       200:
 *         description: Time entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Time entry not found
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Time entry ID is required'
      });
    }

    // Check if time entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id, userId }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    await prisma.timeEntry.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Time entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries/weekly-summary:
 *   get:
 *     summary: Get weekly hours summary
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/WeeklySummary'
 *       401:
 *         description: Unauthorized
 */
router.get('/weekly-summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    const totalHours = timeEntries.reduce((total, entry) => {
      return total + entry.hours + (entry.minutes / 60);
    }, 0);

    // Get user's weekly goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { weeklyGoal: true }
    });

    const goal = user?.weeklyGoal || 40; // Use user's goal or default
    const remaining = Math.max(0, goal - totalHours);
    const progressPercentage = Math.min(100, (totalHours / goal) * 100);

    res.json({
      success: true,
      data: {
        totalHours: parseFloat(totalHours.toFixed(2)),
        goal,
        remaining: parseFloat(remaining.toFixed(2)),
        progressPercentage: parseFloat(progressPercentage.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries/profile:
 *   get:
 *     summary: Get user profile with weekly goal
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user123"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         role:
 *                           type: string
 *                           example: "employee"
 *                         weeklyGoal:
 *                           type: integer
 *                           example: 40
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        weeklyGoal: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /time-entries/profile/weekly-goal:
 *   put:
 *     summary: Update user's weekly goal
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weeklyGoal
 *             properties:
 *               weeklyGoal:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 80
 *                 description: Weekly goal in hours
 *                 example: 40
 *     responses:
 *       200:
 *         description: Weekly goal updated successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user123"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         role:
 *                           type: string
 *                           example: "employee"
 *                         weeklyGoal:
 *                           type: integer
 *                           example: 40
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *                   example: "Weekly goal updated successfully"
 *       400:
 *         description: Invalid weekly goal value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.put('/profile/weekly-goal', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { weeklyGoal } = req.body;

    if (!weeklyGoal || weeklyGoal < 1 || weeklyGoal > 80) {
      return res.status(400).json({
        success: false,
        message: 'Weekly goal must be between 1 and 80 hours'
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { weeklyGoal: parseInt(weeklyGoal) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        weeklyGoal: true,
        isActive: true,
        createdAt: true
      }
    });

    return res.json({
      success: true,
      data: { user },
      message: 'Weekly goal updated successfully'
    });
  } catch (error) {
    console.error('Error updating weekly goal:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
