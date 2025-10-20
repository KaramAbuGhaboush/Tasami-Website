"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const date_fns_1 = require("date-fns");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { date, hours, minutes, project, description } = req.body;
        const userId = req.user.id;
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
    }
    catch (error) {
        console.error('Error creating time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { filter = 'all', page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        let whereClause = { userId };
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
    }
    catch (error) {
        console.error('Error fetching time entries:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, hours, minutes, project, description } = req.body;
        const userId = req.user.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Time entry ID is required'
            });
        }
        const existingEntry = await prisma.timeEntry.findFirst({
            where: { id, userId }
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
            where: { id },
            data: updateData
        });
        return res.json({
            success: true,
            data: timeEntry,
            message: 'Time entry updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Time entry ID is required'
            });
        }
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
    }
    catch (error) {
        console.error('Error deleting time entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/weekly-summary', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(now);
        const weekEnd = (0, date_fns_1.endOfWeek)(now);
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
        const goal = 40;
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
    }
    catch (error) {
        console.error('Error fetching weekly summary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=timeEntries.js.map