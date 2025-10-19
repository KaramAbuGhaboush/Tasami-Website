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
        const { page = 1, limit = 10, category, featured } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { status: 'active' };
        if (category)
            where.category = category;
        if (featured !== undefined)
            where.featured = featured === 'true';
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true,
                    technologies: true,
                    results: true,
                    clientTestimonial: true
                }
            }),
            prisma.project.count({ where })
        ]);
        const transformedProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.headerImage,
            category: project.category?.name || 'Uncategorized',
            technologies: project.technologies.map(tech => tech.name),
            results: project.results.map(result => `${result.metric}: ${result.description}`),
            featured: project.featured,
            status: project.status,
            timeline: project.timeline,
            teamSize: project.teamSize,
            challenge: project.challenge,
            solution: project.solution,
            clientTestimonial: project.clientTestimonial,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }));
        return res.json({
            success: true,
            data: {
                projects: transformedProjects,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get projects error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                category: true,
                technologies: true,
                results: true,
                clientTestimonial: true
            }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const transformedProject = {
            id: project.id,
            title: project.title,
            description: project.description,
            headerImage: project.headerImage,
            category: project.category?.name || 'Uncategorized',
            technologies: project.technologies.map(tech => ({
                name: tech.name,
                description: tech.description
            })),
            results: project.results.map(result => ({
                metric: result.metric,
                description: result.description
            })),
            featured: project.featured,
            status: project.status,
            timeline: project.timeline,
            teamSize: project.teamSize,
            challenge: project.challenge,
            solution: project.solution,
            clientTestimonial: project.clientTestimonial,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        };
        return res.json({
            success: true,
            data: { project: transformedProject }
        });
    }
    catch (error) {
        console.error('Get project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map