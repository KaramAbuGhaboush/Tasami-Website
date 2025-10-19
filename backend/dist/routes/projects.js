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
                    technologies: true,
                    results: true,
                    clientTestimonial: true
                }
            }),
            prisma.project.count({ where })
        ]);
        return res.json({
            success: true,
            data: {
                projects,
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
        return res.json({
            success: true,
            data: { project }
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
router.post('/', async (req, res) => {
    try {
        const { title, description, headerImage, challenge, solution, timeline, teamSize, status = 'planning', featured = false, categoryId, technologies = [], results = [] } = req.body;
        if (!title || !description || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and category are required'
            });
        }
        const project = await prisma.project.create({
            data: {
                title,
                description,
                headerImage,
                challenge,
                solution,
                timeline,
                teamSize,
                status,
                featured,
                categoryId,
                technologies: {
                    create: technologies.map((tech) => ({
                        name: tech.name || tech,
                        description: tech.description || ''
                    }))
                },
                results: {
                    create: results.map((result) => ({
                        metric: result.metric || result,
                        description: result.description || ''
                    }))
                }
            },
            include: {
                category: true,
                technologies: true,
                results: true,
                clientTestimonial: true
            }
        });
        return res.status(201).json({
            success: true,
            data: { project }
        });
    }
    catch (error) {
        console.error('Create project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, headerImage, challenge, solution, timeline, teamSize, status, featured, categoryId, technologies = [], results = [] } = req.body;
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(headerImage !== undefined && { headerImage }),
                ...(challenge !== undefined && { challenge }),
                ...(solution !== undefined && { solution }),
                ...(timeline !== undefined && { timeline }),
                ...(teamSize !== undefined && { teamSize }),
                ...(status && { status }),
                ...(featured !== undefined && { featured }),
                ...(categoryId && { categoryId })
            },
            include: {
                category: true,
                technologies: true,
                results: true,
                clientTestimonial: true
            }
        });
        if (technologies.length > 0) {
            await prisma.projectTechnology.deleteMany({
                where: { projectId: id }
            });
            await prisma.projectTechnology.createMany({
                data: technologies.map((tech) => ({
                    projectId: id,
                    name: tech.name || tech,
                    description: tech.description || ''
                }))
            });
        }
        if (results.length > 0) {
            await prisma.projectResult.deleteMany({
                where: { projectId: id }
            });
            await prisma.projectResult.createMany({
                data: results.map((result) => ({
                    projectId: id,
                    metric: result.metric || result,
                    description: result.description || ''
                }))
            });
        }
        const updatedProject = await prisma.project.findUnique({
            where: { id },
            include: {
                category: true,
                technologies: true,
                results: true,
                clientTestimonial: true
            }
        });
        return res.json({
            success: true,
            data: { project: updatedProject }
        });
    }
    catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        await prisma.project.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map