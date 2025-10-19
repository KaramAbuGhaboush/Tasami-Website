"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', async (req, res) => {
    try {
        const { featured, status = 'active' } = req.query;
        const where = { status };
        if (featured !== undefined)
            where.featured = featured === 'true';
        const testimonials = await prisma.testimonial.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        const transformedTestimonials = testimonials.map(testimonial => ({
            id: testimonial.id,
            clientName: testimonial.name,
            clientCompany: testimonial.company,
            clientPosition: testimonial.role,
            clientAvatar: testimonial.initials || '',
            content: testimonial.quote,
            rating: testimonial.rating,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt
        }));
        res.json({
            success: true,
            data: { testimonials: transformedTestimonials }
        });
    }
    catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!testimonial) {
            res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
            return;
        }
        const transformedTestimonial = {
            id: testimonial.id,
            clientName: testimonial.name,
            clientCompany: testimonial.company,
            clientPosition: testimonial.role,
            clientAvatar: testimonial.initials || '',
            content: testimonial.quote,
            rating: testimonial.rating,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt
        };
        res.json({
            success: true,
            data: { testimonial: transformedTestimonial }
        });
    }
    catch (error) {
        console.error('Get testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const testimonialData = req.body;
        if (!testimonialData.name || !testimonialData.quote) {
            res.status(400).json({
                success: false,
                message: 'Name and quote are required'
            });
            return;
        }
        const initials = testimonialData.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
        const testimonial = await prisma.testimonial.create({
            data: {
                name: testimonialData.name,
                role: testimonialData.role || '',
                company: testimonialData.company || '',
                quote: testimonialData.quote,
                rating: testimonialData.rating || 5,
                initials: testimonialData.initials || initials,
                featured: testimonialData.featured || false,
                status: testimonialData.status || 'active'
            }
        });
        res.status(201).json({
            success: true,
            data: { testimonial }
        });
    }
    catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const testimonialData = req.body;
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!existingTestimonial) {
            res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
            return;
        }
        let initials = existingTestimonial.initials;
        if (testimonialData.name && testimonialData.name !== existingTestimonial.name) {
            initials = testimonialData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        const updatedTestimonial = await prisma.testimonial.update({
            where: { id },
            data: {
                name: testimonialData.name || existingTestimonial.name,
                role: testimonialData.role || existingTestimonial.role,
                company: testimonialData.company || existingTestimonial.company,
                quote: testimonialData.quote || existingTestimonial.quote,
                rating: testimonialData.rating !== undefined ? testimonialData.rating : existingTestimonial.rating,
                initials: testimonialData.initials || initials,
                featured: testimonialData.featured !== undefined ? testimonialData.featured : existingTestimonial.featured,
                status: testimonialData.status || existingTestimonial.status
            }
        });
        res.json({
            success: true,
            data: { testimonial: updatedTestimonial }
        });
    }
    catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!existingTestimonial) {
            res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
            return;
        }
        await prisma.testimonial.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=testimonials.js.map