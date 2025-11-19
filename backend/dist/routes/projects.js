"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const localization_1 = require("../utils/localization");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', async (req, res) => {
    try {
        const { category, status } = req.query;
        const locale = (0, localization_1.normalizeLocale)(req.query.locale);
        const isAdminRequest = req.headers.authorization;
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        else if (!isAdminRequest && status !== 'all') {
            where.status = 'active';
        }
        if (category) {
            where.category = {
                OR: [
                    { slug: category },
                    { name: category },
                    { nameAr: category }
                ]
            };
        }
        const projects = await prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                technologies: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        description: true,
                        descriptionAr: true,
                        projectId: true,
                    }
                },
                results: {
                    select: {
                        id: true,
                        metric: true,
                        metricAr: true,
                        description: true,
                        descriptionAr: true,
                        projectId: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        slug: true,
                        description: true,
                        descriptionAr: true,
                        color: true,
                        icon: true,
                        featured: true,
                    }
                },
                clientTestimonial: {
                    select: {
                        id: true,
                        quote: true,
                        quoteAr: true,
                        author: true,
                        authorAr: true,
                        position: true,
                        positionAr: true,
                        projectId: true,
                    }
                },
                contentBlocks: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        type: true,
                        order: true,
                        content: true,
                        contentAr: true,
                        src: true,
                        alt: true,
                        altAr: true,
                        width: true,
                        height: true,
                        caption: true,
                        captionAr: true,
                        level: true,
                        columns: true,
                        images: true,
                        projectId: true,
                    }
                }
            }
        });
        const transformedProjects = projects.map((project) => {
            const transformedProject = (0, localization_1.transformProjectByLocale)(project, locale);
            const transformedCategory = (0, localization_1.transformProjectCategoryByLocale)(project.category, locale);
            const transformedTechnologies = (project.technologies || []).map((tech) => (0, localization_1.transformProjectTechnologyByLocale)(tech, locale));
            const transformedResults = (project.results || []).map((result) => (0, localization_1.transformProjectResultByLocale)(result, locale));
            const transformedTestimonial = project.clientTestimonial
                ? (0, localization_1.transformProjectTestimonialByLocale)(project.clientTestimonial, locale)
                : null;
            const transformedContentBlocks = (project.contentBlocks || []).map((block) => (0, localization_1.transformContentBlockByLocale)(block, locale));
            return {
                id: project.id,
                ...transformedProject,
                headerImage: project.headerImage,
                timeline: project.timeline,
                teamSize: project.teamSize,
                status: project.status,
                category: transformedCategory,
                technologies: transformedTechnologies,
                results: transformedResults,
                clientTestimonial: transformedTestimonial,
                contentBlocks: transformedContentBlocks,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            };
        });
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
        const { title, titleAr, description, descriptionAr, headerImage, challenge, challengeAr, solution, solutionAr, timeline, teamSize, status = 'planning', categoryId, technologies = [], results = [], testimonial, contentBlocks = [] } = req.body;
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
                titleAr: titleAr || null,
                description,
                descriptionAr: descriptionAr || null,
                headerImage: headerImage || null,
                challenge: challenge || null,
                challengeAr: challengeAr || null,
                solution: solution || null,
                solutionAr: solutionAr || null,
                timeline: timeline || null,
                teamSize: teamSize || null,
                status,
                categoryId,
                technologies: {
                    create: technologies.map((tech) => ({
                        name: tech.name,
                        nameAr: tech.nameAr || null,
                        description: tech.description,
                        descriptionAr: tech.descriptionAr || null,
                    }))
                },
                results: {
                    create: results.map((result) => ({
                        metric: result.metric,
                        metricAr: result.metricAr || null,
                        description: result.description,
                        descriptionAr: result.descriptionAr || null,
                    }))
                },
                ...(testimonial && {
                    clientTestimonial: {
                        create: {
                            quote: testimonial.quote,
                            quoteAr: testimonial.quoteAr || null,
                            author: testimonial.author,
                            authorAr: testimonial.authorAr || null,
                            position: testimonial.position,
                            positionAr: testimonial.positionAr || null,
                        }
                    }
                }),
                contentBlocks: {
                    create: Array.isArray(contentBlocks) ? contentBlocks.map((block) => ({
                        type: block.type,
                        order: block.order || 0,
                        content: block.content || null,
                        contentAr: block.contentAr || null,
                        level: block.level || null,
                        src: block.src || null,
                        alt: block.alt || null,
                        altAr: block.altAr || null,
                        caption: block.caption || null,
                        captionAr: block.captionAr || null,
                        columns: block.columns || null,
                        images: block.images || null,
                    })) : []
                }
            },
            include: {
                technologies: true,
                results: true,
                clientTestimonial: true,
                category: true,
                contentBlocks: true
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
            where: { id },
            include: {
                clientTestimonial: true
            }
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
        const projectUpdateData = {};
        if (updateData.title !== undefined)
            projectUpdateData.title = updateData.title;
        if (updateData.titleAr !== undefined)
            projectUpdateData.titleAr = updateData.titleAr;
        if (updateData.description !== undefined)
            projectUpdateData.description = updateData.description;
        if (updateData.descriptionAr !== undefined)
            projectUpdateData.descriptionAr = updateData.descriptionAr;
        if (updateData.headerImage !== undefined)
            projectUpdateData.headerImage = updateData.headerImage;
        if (updateData.challenge !== undefined)
            projectUpdateData.challenge = updateData.challenge;
        if (updateData.challengeAr !== undefined)
            projectUpdateData.challengeAr = updateData.challengeAr;
        if (updateData.solution !== undefined)
            projectUpdateData.solution = updateData.solution;
        if (updateData.solutionAr !== undefined)
            projectUpdateData.solutionAr = updateData.solutionAr;
        if (updateData.timeline !== undefined)
            projectUpdateData.timeline = updateData.timeline;
        if (updateData.teamSize !== undefined)
            projectUpdateData.teamSize = updateData.teamSize;
        if (updateData.status !== undefined)
            projectUpdateData.status = updateData.status;
        if (updateData.categoryId !== undefined)
            projectUpdateData.categoryId = updateData.categoryId;
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...projectUpdateData,
                ...(updateData.technologies && {
                    technologies: {
                        deleteMany: {},
                        create: updateData.technologies.map((tech) => ({
                            name: tech.name,
                            nameAr: tech.nameAr || null,
                            description: tech.description,
                            descriptionAr: tech.descriptionAr || null,
                        }))
                    }
                }),
                ...(updateData.results && {
                    results: {
                        deleteMany: {},
                        create: updateData.results.map((result) => ({
                            metric: result.metric,
                            metricAr: result.metricAr || null,
                            description: result.description,
                            descriptionAr: result.descriptionAr || null,
                        }))
                    }
                }),
                ...(updateData.testimonial && {
                    clientTestimonial: {
                        upsert: {
                            create: {
                                quote: updateData.testimonial.quote,
                                quoteAr: updateData.testimonial.quoteAr || null,
                                author: updateData.testimonial.author,
                                authorAr: updateData.testimonial.authorAr || null,
                                position: updateData.testimonial.position,
                                positionAr: updateData.testimonial.positionAr || null,
                            },
                            update: {
                                quote: updateData.testimonial.quote,
                                quoteAr: updateData.testimonial.quoteAr !== undefined ? updateData.testimonial.quoteAr : existingProject.clientTestimonial?.quoteAr || null,
                                author: updateData.testimonial.author,
                                authorAr: updateData.testimonial.authorAr !== undefined ? updateData.testimonial.authorAr : existingProject.clientTestimonial?.authorAr || null,
                                position: updateData.testimonial.position,
                                positionAr: updateData.testimonial.positionAr !== undefined ? updateData.testimonial.positionAr : existingProject.clientTestimonial?.positionAr || null,
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
        const locale = (0, localization_1.normalizeLocale)(req.query.locale);
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                technologies: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        description: true,
                        descriptionAr: true,
                        projectId: true,
                    }
                },
                results: {
                    select: {
                        id: true,
                        metric: true,
                        metricAr: true,
                        description: true,
                        descriptionAr: true,
                        projectId: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        slug: true,
                        description: true,
                        descriptionAr: true,
                        color: true,
                        icon: true,
                        featured: true,
                    }
                },
                clientTestimonial: {
                    select: {
                        id: true,
                        quote: true,
                        quoteAr: true,
                        author: true,
                        authorAr: true,
                        position: true,
                        positionAr: true,
                        projectId: true,
                    }
                },
                contentBlocks: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        type: true,
                        order: true,
                        content: true,
                        contentAr: true,
                        src: true,
                        alt: true,
                        altAr: true,
                        width: true,
                        height: true,
                        caption: true,
                        captionAr: true,
                        level: true,
                        columns: true,
                        images: true,
                        projectId: true,
                    }
                }
            }
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        const projectData = project;
        const transformedProject = (0, localization_1.transformProjectByLocale)(projectData, locale);
        const transformedCategory = (0, localization_1.transformProjectCategoryByLocale)(projectData.category, locale);
        const transformedTechnologies = (projectData.technologies || []).map((tech) => (0, localization_1.transformProjectTechnologyByLocale)(tech, locale));
        const transformedResults = (projectData.results || []).map((result) => (0, localization_1.transformProjectResultByLocale)(result, locale));
        const transformedTestimonial = projectData.clientTestimonial
            ? (0, localization_1.transformProjectTestimonialByLocale)(projectData.clientTestimonial, locale)
            : null;
        const transformedContentBlocks = (projectData.contentBlocks || []).map((block) => (0, localization_1.transformContentBlockByLocale)(block, locale));
        const finalProject = {
            id: projectData.id,
            ...transformedProject,
            headerImage: projectData.headerImage,
            timeline: projectData.timeline,
            teamSize: projectData.teamSize,
            status: projectData.status,
            category: transformedCategory,
            technologies: transformedTechnologies,
            results: transformedResults,
            contentBlocks: transformedContentBlocks,
            clientTestimonial: transformedTestimonial,
            createdAt: projectData.createdAt,
            updatedAt: projectData.updatedAt
        };
        return res.json({
            success: true,
            data: { project: finalProject }
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
                blocks: allBlocks.map((b) => ({
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
        console.log('Found block IDs:', existingBlocks.map((b) => b.id));
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
                foundBlockIds: existingBlocks.map((b) => b.id)
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