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
                category: true
            }
        });
        const transformedProjects = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.headerImage,
            category: project.category.name,
            status: project.status,
            technologies: project.technologies,
            results: project.results,
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
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                technologies: true,
                results: true,
                category: true
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
            image: project.headerImage,
            category: project.category.name,
            status: project.status,
            technologies: project.technologies,
            results: project.results,
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