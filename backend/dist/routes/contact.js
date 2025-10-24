"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const emailService_1 = __importDefault(require("../services/emailService"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const emailService = new emailService_1.default();
router.get('/messages', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const status = req.query.status;
        const service = req.query.service;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const where = {};
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
        const total = await prisma.contactMessage.count({ where });
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
    }
    catch (error) {
        console.error('Get contact messages error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/messages', async (req, res) => {
    try {
        const { name, email, company, message, service, budget } = req.body;
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
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { contactMessage: responseMessage }
        });
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
            }
            catch (emailError) {
                console.error('Failed to send contact notification email:', emailError);
            }
        });
        return;
    }
    catch (error) {
        console.error('Submit contact message error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const messageData = req.body;
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
    }
    catch (error) {
        console.error('Update contact message error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingMessage = await prisma.contactMessage.findUnique({
            where: { id }
        });
        if (!existingMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        await prisma.contactMessage.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete contact message error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/test-email', async (req, res) => {
    try {
        const isConnected = await emailService.testConnection();
        if (isConnected) {
            return res.json({
                success: true,
                message: 'Email configuration test successful'
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: 'Email configuration test failed'
            });
        }
    }
    catch (error) {
        console.error('Email test error:', error);
        return res.status(500).json({
            success: false,
            message: 'Email test failed: ' + error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map