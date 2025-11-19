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
router.get('/stats', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                role: true,
                isActive: true,
                createdAt: true,
                weeklyGoal: true
            }
        });
        const now = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(now);
        const weekEnd = (0, date_fns_1.endOfWeek)(now);
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                date: {
                    gte: weekStart,
                    lte: weekEnd
                }
            }
        });
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;
        const adminUsers = users.filter(user => user.role === 'admin').length;
        const employeeUsers = users.filter(user => user.role === 'employee').length;
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersThisMonth = users.filter(user => new Date(user.createdAt) >= startOfMonth).length;
        const usersMeetingGoals = users.filter(user => {
            const userEntries = timeEntries.filter((entry) => entry.userId === user.id);
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
    }
    catch (error) {
        console.error('Error fetching employee stats:', error);
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
router.put('/:id/password', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        const existingEmployee = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        await prisma.user.update({
            where: { id: id },
            data: { password: hashedPassword }
        });
        return res.json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/goal', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { weeklyGoal } = req.body;
        if (!weeklyGoal || weeklyGoal < 1 || weeklyGoal > 80) {
            return res.status(400).json({
                success: false,
                message: 'Weekly goal must be between 1 and 80 hours'
            });
        }
        const existingEmployee = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        const updatedEmployee = await prisma.user.update({
            where: { id: id },
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
    }
    catch (error) {
        console.error('Error updating weekly goal:', error);
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
router.put('/:id/time-entries/:entryId', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id, entryId } = req.params;
        const { date, hours, minutes, project, description } = req.body;
        if (!id || !entryId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and Time entry ID are required'
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
        const existingEntry = await prisma.timeEntry.findFirst({
            where: { id: entryId, userId: id }
        });
        if (!existingEntry) {
            return res.status(404).json({
                success: false,
                message: 'Time entry not found'
            });
        }
        if (hours !== undefined && (hours < 0 || minutes < 0 || minutes >= 60)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hours or minutes'
            });
        }
        const updateData = {};
        if (date)
            updateData.date = new Date(date);
        if (hours !== undefined)
            updateData.hours = parseInt(hours);
        if (minutes !== undefined)
            updateData.minutes = parseInt(minutes);
        if (project)
            updateData.project = project;
        if (description !== undefined)
            updateData.description = description;
        const timeEntry = await prisma.timeEntry.update({
            where: { id: entryId },
            data: updateData
        });
        return res.json({
            success: true,
            data: timeEntry,
            message: 'Time entry updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating employee time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id/time-entries/:entryId', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id, entryId } = req.params;
        if (!id || !entryId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID and Time entry ID are required'
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
    }
    catch (error) {
        console.error('Error deleting employee time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/:id/time-entries', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, hours, minutes, project, description } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }
        if (!date || hours === undefined || minutes === undefined || !project) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: date, hours, minutes, project'
            });
        }
        if (hours < 0 || minutes < 0 || minutes >= 60) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hours or minutes'
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
    }
    catch (error) {
        console.error('Error creating employee time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/analytics/team-summary', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const now = new Date();
        const weekStart = startDate ? new Date(startDate) : (0, date_fns_1.startOfWeek)(now);
        const weekEnd = endDate ? new Date(endDate) : (0, date_fns_1.endOfWeek)(now);
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
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                date: {
                    gte: weekStart,
                    lte: weekEnd
                }
            }
        });
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.isActive).length;
        const totalHours = timeEntries.reduce((total, entry) => {
            return total + entry.hours + (entry.minutes / 60);
        }, 0);
        const averageHoursPerUser = activeUsers > 0 ? totalHours / activeUsers : 0;
        const userGoalStats = users.map(user => {
            const userEntries = timeEntries.filter((entry) => entry.userId === user.id);
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
    }
    catch (error) {
        console.error('Error fetching team analytics:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/analytics/project-distribution', auth_1.authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const now = new Date();
        const weekStart = startDate ? new Date(startDate) : (0, date_fns_1.startOfWeek)(now);
        const weekEnd = endDate ? new Date(endDate) : (0, date_fns_1.endOfWeek)(now);
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                date: {
                    gte: weekStart,
                    lte: weekEnd
                }
            }
        });
        const projectStats = {};
        timeEntries.forEach((entry) => {
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
    }
    catch (error) {
        console.error('Error fetching project distribution:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/bulk-update', auth_1.authMiddleware, requireAdmin, async (req, res) => {
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
        const updateData = {};
        if (updates.role)
            updateData.role = updates.role;
        if (updates.isActive !== undefined)
            updateData.isActive = updates.isActive;
        if (updates.weeklyGoal !== undefined)
            updateData.weeklyGoal = updates.weeklyGoal;
        const failedUpdates = [];
        let updatedCount = 0;
        for (const userId of userIds) {
            try {
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
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('Error in bulk update:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=employees.js.map