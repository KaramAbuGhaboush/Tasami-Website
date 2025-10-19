"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/messages', async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json({
            success: true,
            data: { messages }
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
        const { name, email, phone, company, subject, message, service, budget } = req.body;
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
exports.default = router;
//# sourceMappingURL=contact.js.map