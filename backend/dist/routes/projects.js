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
        const { category } = req.query;
        const where = { status: 'active' };
        if (category)
            where.category = category;
        const projects = await prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                technologies: true,
                results: true,
                category: true,
                clientTestimonial: true,
                contentBlocks: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        const transformedProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            headerImage: project.headerImage,
            challenge: project.challenge,
            solution: project.solution,
            timeline: project.timeline,
            teamSize: project.teamSize,
            status: project.status,
            category: project.category,
            technologies: project.technologies,
            results: project.results,
            clientTestimonial: project.clientTestimonial,
            contentBlocks: project.contentBlocks || [],
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }));
        return res.json({
            success: true,
            data: {
                projects: transformedProjects
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
router.post('/', async (req, res) => {
    try {
        const { title, description, headerImage, challenge, solution, timeline, teamSize, status = 'planning', categoryId, technologies = [], results = [], testimonial } = req.body;
        if (!title || !description || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and categoryId are required'
            });
        }
        const category = await prisma.projectCategory.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const project = await prisma.project.create({
            data: {
                title,
                description,
                headerImage: headerImage || null,
                challenge: challenge || null,
                solution: solution || null,
                timeline: timeline || null,
                teamSize: teamSize || null,
                status,
                categoryId,
                technologies: {
                    create: technologies.map((tech) => ({
                        name: tech.name,
                        description: tech.description
                    }))
                },
                results: {
                    create: results.map((result) => ({
                        metric: result.metric,
                        description: result.description
                    }))
                },
                ...(testimonial && {
                    clientTestimonial: {
                        create: {
                            quote: testimonial.quote,
                            author: testimonial.author,
                            position: testimonial.position
                        }
                    }
                })
            },
            include: {
                technologies: true,
                results: true,
                clientTestimonial: true,
                category: true
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
        const updateData = req.body;
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        if (updateData.categoryId) {
            const category = await prisma.projectCategory.findUnique({
                where: { id: updateData.categoryId }
            });
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }
        const project = await prisma.project.update({
            where: { id },
            data: {
                title: updateData.title,
                description: updateData.description,
                headerImage: updateData.headerImage,
                challenge: updateData.challenge,
                solution: updateData.solution,
                timeline: updateData.timeline,
                teamSize: updateData.teamSize,
                status: updateData.status,
                categoryId: updateData.categoryId,
                ...(updateData.technologies && {
                    technologies: {
                        deleteMany: {},
                        create: updateData.technologies.map((tech) => ({
                            name: tech.name,
                            description: tech.description
                        }))
                    }
                }),
                ...(updateData.results && {
                    results: {
                        deleteMany: {},
                        create: updateData.results.map((result) => ({
                            metric: result.metric,
                            description: result.description
                        }))
                    }
                }),
                ...(updateData.testimonial && {
                    clientTestimonial: {
                        upsert: {
                            create: {
                                quote: updateData.testimonial.quote,
                                author: updateData.testimonial.author,
                                position: updateData.testimonial.position
                            },
                            update: {
                                quote: updateData.testimonial.quote,
                                author: updateData.testimonial.author,
                                position: updateData.testimonial.position
                            }
                        }
                    }
                })
            },
            include: {
                technologies: true,
                results: true,
                clientTestimonial: true,
                category: true,
                contentBlocks: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        return res.json({
            success: true,
            data: { project }
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
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                technologies: true,
                results: true,
                category: true,
                clientTestimonial: true,
                contentBlocks: {
                    orderBy: { order: 'asc' }
                }
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
            challenge: project.challenge,
            solution: project.solution,
            timeline: project.timeline,
            teamSize: project.teamSize,
            status: project.status,
            category: project.category,
            technologies: project.technologies,
            results: project.results,
            contentBlocks: project.contentBlocks,
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
router.post('/:id/content-blocks', async (req, res) => {
    try {
        const { id } = req.params;
        const contentBlockData = req.body;
        const project = await prisma.project.findUnique({
            where: { id }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const contentBlock = await prisma.contentBlock.create({
            data: {
                ...contentBlockData,
                projectId: id
            }
        });
        return res.status(201).json({
            success: true,
            data: { contentBlock }
        });
    }
    catch (error) {
        console.error('Create content block error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/content-blocks/reorder', async (req, res) => {
    try {
        const { id } = req.params;
        const { blocks } = req.body;
        const project = await prisma.project.findUnique({
            where: { id }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const blockIds = blocks.map((b) => b.id);
        const existingBlocks = await prisma.contentBlock.findMany({
            where: {
                id: { in: blockIds },
                projectId: id
            }
        });
        if (existingBlocks.length !== blocks.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more content blocks not found'
            });
        }
        for (const block of blocks) {
            await prisma.contentBlock.update({
                where: { id: block.id },
                data: { order: block.order }
            });
        }
        return res.json({
            success: true,
            message: 'Content blocks reordered successfully'
        });
    }
    catch (error) {
        console.error('Reorder content blocks error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/content-blocks/:blockId', async (req, res) => {
    try {
        const { id, blockId } = req.params;
        const updateData = req.body;
        const existingBlock = await prisma.contentBlock.findFirst({
            where: {
                id: blockId,
                projectId: id
            }
        });
        if (!existingBlock) {
            return res.status(404).json({
                success: false,
                message: 'Content block not found'
            });
        }
        const contentBlock = await prisma.contentBlock.update({
            where: { id: blockId },
            data: updateData
        });
        return res.json({
            success: true,
            data: { contentBlock }
        });
    }
    catch (error) {
        console.error('Update content block error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id/content-blocks/:blockId', async (req, res) => {
    try {
        const { id, blockId } = req.params;
        const existingBlock = await prisma.contentBlock.findFirst({
            where: {
                id: blockId,
                projectId: id
            }
        });
        if (!existingBlock) {
            return res.status(404).json({
                success: false,
                message: 'Content block not found'
            });
        }
        await prisma.contentBlock.delete({
            where: { id: blockId }
        });
        return res.json({
            success: true,
            message: 'Content block deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete content block error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id/debug-content-blocks', async (req, res) => {
    try {
        const { id } = req.params;
        const allBlocks = await prisma.contentBlock.findMany({
            where: { projectId: id }
        });
        return res.json({
            success: true,
            data: {
                projectId: id,
                totalBlocks: allBlocks.length,
                blocks: allBlocks.map(b => ({
                    id: b.id,
                    type: b.type,
                    order: b.order,
                    projectId: b.projectId
                }))
            }
        });
    }
    catch (error) {
        console.error('Debug content blocks error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id/test-reorder', async (req, res) => {
    try {
        const { id } = req.params;
        const { blocks } = req.body;
        console.log('Test reorder request:', { projectId: id, blocks });
        const project = await prisma.project.findUnique({
            where: { id }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const blockIds = blocks.map((b) => b.id);
        console.log('Looking for block IDs:', blockIds);
        const existingBlocks = await prisma.contentBlock.findMany({
            where: {
                id: { in: blockIds },
                projectId: id
            }
        });
        console.log('Found blocks:', existingBlocks.length);
        console.log('Found block IDs:', existingBlocks.map(b => b.id));
        if (existingBlocks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No content blocks found',
                debug: {
                    requestedIds: blockIds,
                    projectId: id,
                    foundBlocks: existingBlocks.length
                }
            });
        }
        return res.json({
            success: true,
            message: 'Test successful',
            debug: {
                requestedIds: blockIds,
                projectId: id,
                foundBlocks: existingBlocks.length,
                foundBlockIds: existingBlocks.map(b => b.id)
            }
        });
    }
    catch (error) {
        console.error('Test reorder error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map