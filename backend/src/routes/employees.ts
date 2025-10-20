import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { startOfWeek, endOfWeek } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the employee
 *         name:
 *           type: string
 *           description: Employee's full name
 *         email:
 *           type: string
 *           format: email
 *           description: Employee's email address
 *         role:
 *           type: string
 *           enum: [employee, admin]
 *           description: Employee's role
 *         isActive:
 *           type: boolean
 *           description: Whether the employee is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Middleware to check if user is admin
const requireAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
};

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
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
 *         description: Items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [employee, admin]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
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
 *                         $ref: '#/components/schemas/Employee'
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
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = {};
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const [employees, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return res.json({
      success: true,
      data: {
        items: employees,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [employee, admin]
 *                 default: employee
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'employee', isActive = true } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password'
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if trying to create admin when one already exists
    if (role === 'admin') {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Only one admin can exist in the system'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const employee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get specific employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.get('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    return res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [employee, admin]
 *               isActive:
 *                 type: boolean
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employee'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.put('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive, password } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== existingEmployee.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check if trying to create another admin
    if (role === 'admin' && existingEmployee.role !== 'admin') {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: 'admin' }
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Only one admin can exist in the system'
        });
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
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
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.delete('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Prevent admin from deleting themselves
    if (id === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}/time-entries:
 *   get:
 *     summary: Get employee's time entries (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
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
 *         description: Employee time entries retrieved successfully
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
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.get('/:id/time-entries', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { filter = 'all', page = 1, limit = 10 } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }
    
    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = { userId: id };

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

    return res.json({
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
    console.error('Error fetching employee time entries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}/weekly-summary:
 *   get:
 *     summary: Get employee's weekly summary (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee weekly summary retrieved successfully
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
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.get('/:id/weekly-summary', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: id,
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    const totalHours = timeEntries.reduce((total, entry) => {
      return total + entry.hours + (entry.minutes / 60);
    }, 0);

    const goal = 40; // Default weekly goal
    const remaining = Math.max(0, goal - totalHours);
    const progressPercentage = Math.min(100, (totalHours / goal) * 100);

    return res.json({
      success: true,
      data: {
        totalHours: parseFloat(totalHours.toFixed(2)),
        goal,
        remaining: parseFloat(remaining.toFixed(2)),
        progressPercentage: parseFloat(progressPercentage.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error fetching employee weekly summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
