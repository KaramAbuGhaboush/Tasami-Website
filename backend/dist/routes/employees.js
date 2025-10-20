"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const requireAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }
        return next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
};
router.get('/', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, role, isActive } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        let whereClause = {};
        if (role)
            whereClause.role = role;
        if (isActive !== undefined)
            whereClause.isActive = isActive === 'true';
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
    }
    catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, role = 'employee', isActive = true } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, email, password'
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
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
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
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
    }
    catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id', auth_1.authMiddleware, requireAdmin, async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive, password } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }
        const existingEmployee = await prisma.user.findUnique({
            where: { id }
        });
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
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
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (password) {
            updateData.password = await bcrypt_1.default.hash(password, 12);
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
    }
    catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }
        if (id === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }
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
    }
    catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id/time-entries', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { filter = 'all', page = 1, limit = 10 } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }
        const employee = await prisma.user.findUnique({
            where: { id }
        });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        let whereClause = { userId: id };
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
                const weekStart = (0, date_fns_1.startOfWeek)(now);
                const weekEnd = (0, date_fns_1.endOfWeek)(now);
                whereClause.date = {
                    gte: weekStart,
                    lte: weekEnd
                };
                break;
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
    }
    catch (error) {
        console.error('Error fetching employee time entries:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id/weekly-summary', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }
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
        const weekStart = (0, date_fns_1.startOfWeek)(now);
        const weekEnd = (0, date_fns_1.endOfWeek)(now);
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
        const goal = 40;
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
    }
    catch (error) {
        console.error('Error fetching employee weekly summary:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=employees.js.map