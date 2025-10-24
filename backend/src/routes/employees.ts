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
          weeklyGoal: true,
          department: true,
          phone: true,
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
 * /employees/stats:
 *   get:
 *     summary: Get employee statistics dashboard (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee statistics retrieved successfully
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
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     inactiveUsers:
 *                       type: integer
 *                     adminUsers:
 *                       type: integer
 *                     employeeUsers:
 *                       type: integer
 *                     newUsersThisMonth:
 *                       type: integer
 *                     usersMeetingGoals:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/stats', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        isActive: true,
        createdAt: true,
        weeklyGoal: true
      }
    });

    // Get current week time entries for goal calculation
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const employeeUsers = users.filter(user => user.role === 'employee').length;

    // New users this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = users.filter(user => 
      new Date(user.createdAt) >= startOfMonth
    ).length;

    // Users meeting goals
    const usersMeetingGoals = users.filter(user => {
      const userEntries = timeEntries.filter(entry => entry.userId === user.id);
      const userHours = userEntries.reduce((total, entry) => {
        return total + entry.hours + (entry.minutes / 60);
      }, 0);
      const goal = user.weeklyGoal || 40;
      return userHours >= goal;
    }).length;

    return res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        employeeUsers,
        newUsersThisMonth,
        usersMeetingGoals
      }
    });
  } catch (error) {
    console.error('Error fetching employee stats:', error);
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
 * /employees/{id}/password:
 *   put:
 *     summary: Reset employee password (Admin only)
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
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - Invalid password
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.put('/:id/password', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id: id as string }
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await prisma.user.update({
      where: { id: id as string },
      data: { password: hashedPassword }
    });

    return res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}/goal:
 *   put:
 *     summary: Update employee's weekly goal (Admin only)
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
 *             required:
 *               - weeklyGoal
 *             properties:
 *               weeklyGoal:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 80
 *                 description: Weekly goal in hours
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     employee:
 *                       type: object
 *       400:
 *         description: Bad request - Invalid weekly goal
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/goal', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { weeklyGoal } = req.body;

    if (!weeklyGoal || weeklyGoal < 1 || weeklyGoal > 80) {
      return res.status(400).json({
        success: false,
        message: 'Weekly goal must be between 1 and 80 hours'
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id: id as string }
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update weekly goal
    const updatedEmployee = await prisma.user.update({
      where: { id: id as string },
      data: { weeklyGoal: parseInt(weeklyGoal) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        weeklyGoal: true,
        department: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      message: 'Weekly goal updated successfully',
      data: { employee: updatedEmployee }
    });
  } catch (error) {
    console.error('Error updating weekly goal:', error);
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

/**
 * @swagger
 * /employees/{id}/time-entries/{entryId}:
 *   put:
 *     summary: Update employee's time entry (Admin only)
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
 *       - in: path
 *         name: entryId
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
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee or time entry not found
 */
router.put('/:id/time-entries/:entryId', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id, entryId } = req.params;
    const { date, hours, minutes, project, description } = req.body;

    if (!id || !entryId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Time entry ID are required'
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

    // Check if time entry exists and belongs to employee
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId: id }
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
      where: { id: entryId },
      data: updateData
    });

    return res.json({
      success: true,
      data: timeEntry,
      message: 'Time entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}/time-entries/{entryId}:
 *   delete:
 *     summary: Delete employee's time entry (Admin only)
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
 *       - in: path
 *         name: entryId
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee or time entry not found
 */
router.delete('/:id/time-entries/:entryId', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id, entryId } = req.params;

    if (!id || !entryId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and Time entry ID are required'
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

    // Check if time entry exists and belongs to employee
    const existingEntry = await prisma.timeEntry.findFirst({
      where: { id: entryId, userId: id }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found'
      });
    }

    await prisma.timeEntry.delete({
      where: { id: entryId }
    });

    return res.json({
      success: true,
      message: 'Time entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/{id}/time-entries:
 *   post:
 *     summary: Create time entry for employee (Admin only)
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
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Employee not found
 */
router.post('/:id/time-entries', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, hours, minutes, project, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

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

    const timeEntry = await prisma.timeEntry.create({
      data: {
        date: new Date(date),
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        project,
        description,
        userId: id
      }
    });

    return res.status(201).json({
      success: true,
      data: timeEntry,
      message: 'Time entry created successfully'
    });
  } catch (error) {
    console.error('Error creating employee time entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/analytics/team-summary:
 *   get:
 *     summary: Get team-wide analytics summary (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (default start of current week)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (default end of current week)
 *     responses:
 *       200:
 *         description: Team analytics retrieved successfully
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
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     totalHours:
 *                       type: number
 *                     averageHoursPerUser:
 *                       type: number
 *                     goalAchievementRate:
 *                       type: number
 *                     usersMeetingGoals:
 *                       type: integer
 *                     usersExceedingGoals:
 *                       type: integer
 *                     usersBelowGoals:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/analytics/team-summary', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to current week if no dates provided
    const now = new Date();
    const weekStart = startDate ? new Date(startDate as string) : startOfWeek(now);
    const weekEnd = endDate ? new Date(endDate as string) : endOfWeek(now);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        weeklyGoal: true
      }
    });

    // Get time entries for the period
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    // Calculate analytics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    
    const totalHours = timeEntries.reduce((total, entry) => {
      return total + entry.hours + (entry.minutes / 60);
    }, 0);

    const averageHoursPerUser = activeUsers > 0 ? totalHours / activeUsers : 0;

    // Calculate goal achievement
    const userGoalStats = users.map(user => {
      const userEntries = timeEntries.filter(entry => entry.userId === user.id);
      const userHours = userEntries.reduce((total, entry) => {
        return total + entry.hours + (entry.minutes / 60);
      }, 0);
      
      const goal = user.weeklyGoal || 40;
      return {
        userId: user.id,
        hours: userHours,
        goal: goal,
        meetsGoal: userHours >= goal,
        exceedsGoal: userHours > goal
      };
    });

    const usersMeetingGoals = userGoalStats.filter(stat => stat.meetsGoal).length;
    const usersExceedingGoals = userGoalStats.filter(stat => stat.exceedsGoal).length;
    const usersBelowGoals = userGoalStats.filter(stat => !stat.meetsGoal).length;
    const goalAchievementRate = activeUsers > 0 ? (usersMeetingGoals / activeUsers) * 100 : 0;

    return res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalHours: parseFloat(totalHours.toFixed(2)),
        averageHoursPerUser: parseFloat(averageHoursPerUser.toFixed(2)),
        goalAchievementRate: parseFloat(goalAchievementRate.toFixed(2)),
        usersMeetingGoals,
        usersExceedingGoals,
        usersBelowGoals,
        period: {
          startDate: weekStart,
          endDate: weekEnd
        }
      }
    });
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /employees/analytics/project-distribution:
 *   get:
 *     summary: Get time distribution across projects (Admin only)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (default start of current week)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (default end of current week)
 *     responses:
 *       200:
 *         description: Project distribution retrieved successfully
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           project:
 *                             type: string
 *                           totalHours:
 *                             type: number
 *                           percentage:
 *                             type: number
 *                           userCount:
 *                             type: integer
 *                     totalHours:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/analytics/project-distribution', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to current week if no dates provided
    const now = new Date();
    const weekStart = startDate ? new Date(startDate as string) : startOfWeek(now);
    const weekEnd = endDate ? new Date(endDate as string) : endOfWeek(now);

    // Get time entries for the period
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    // Calculate project distribution
    const projectStats: { [key: string]: { hours: number; users: Set<string> } } = {};
    
    timeEntries.forEach(entry => {
      const project = entry.project;
      const hours = entry.hours + (entry.minutes / 60);
      
      if (!projectStats[project]) {
        projectStats[project] = { hours: 0, users: new Set() };
      }
      
      projectStats[project].hours += hours;
      projectStats[project].users.add(entry.userId);
    });

    const totalHours = Object.values(projectStats).reduce((total, stat) => total + stat.hours, 0);

    const projects = Object.entries(projectStats).map(([project, stats]) => ({
      project,
      totalHours: parseFloat(stats.hours.toFixed(2)),
      percentage: totalHours > 0 ? parseFloat(((stats.hours / totalHours) * 100).toFixed(2)) : 0,
      userCount: stats.users.size
    })).sort((a, b) => b.totalHours - a.totalHours);

    return res.json({
      success: true,
      data: {
        projects,
        totalHours: parseFloat(totalHours.toFixed(2)),
        period: {
          startDate: weekStart,
          endDate: weekEnd
        }
      }
    });
  } catch (error) {
    console.error('Error fetching project distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


/**
 * @swagger
 * /employees/bulk-update:
 *   post:
 *     summary: Bulk update employees (Admin only)
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
 *               - userIds
 *               - updates
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs to update
 *               updates:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [employee, admin]
 *                   isActive:
 *                     type: boolean
 *                   weeklyGoal:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 80
 *     responses:
 *       200:
 *         description: Employees updated successfully
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
 *                     updatedCount:
 *                       type: integer
 *                     failedUpdates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           error:
 *                             type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.post('/bulk-update', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required and must not be empty'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required and must not be empty'
      });
    }

    const updateData: any = {};
    if (updates.role) updateData.role = updates.role;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.weeklyGoal !== undefined) updateData.weeklyGoal = updates.weeklyGoal;

    const failedUpdates: any[] = [];
    let updatedCount = 0;

    // Process each user update
    for (const userId of userIds) {
      try {
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (!user) {
          failedUpdates.push({
            userId,
            error: 'User not found'
          });
          continue;
        }

        // Check admin role restrictions
        if (updates.role === 'admin' && user.role !== 'admin') {
          const existingAdmin = await prisma.user.findFirst({
            where: { role: 'admin' }
          });

          if (existingAdmin) {
            failedUpdates.push({
              userId,
              error: 'Only one admin can exist in the system'
            });
            continue;
          }
        }

        await prisma.user.update({
          where: { id: userId },
          data: updateData
        });

        updatedCount++;
      } catch (error) {
        failedUpdates.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return res.json({
      success: true,
      data: {
        updatedCount,
        failedUpdates
      },
      message: `Successfully updated ${updatedCount} out of ${userIds.length} users`
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
