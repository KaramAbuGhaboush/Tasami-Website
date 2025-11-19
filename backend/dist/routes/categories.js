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
        const { featured, status = 'active' } = req.query;
        const locale = (0, localization_1.normalizeLocale)(req.query.locale);
        const where = { status };
        if (featured !== undefined)
            where.featured = featured === 'true';
        const categories = await prisma.projectCategory.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
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
                sortOrder: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        const transformedCategories = (0, localization_1.transformProjectCategoriesByLocale)(categories, locale);
        res.json({
            success: true,
            data: { categories: transformedCategories }
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const locale = (0, localization_1.normalizeLocale)(req.query.locale);
        const category = await prisma.projectCategory.findUnique({
            where: { id },
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
                sortOrder: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        const transformedCategory = (0, localization_1.transformProjectCategoryByLocale)(category, locale);
        res.json({
            success: true,
            data: { category: transformedCategory }
        });
    }
    catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const categoryData = req.body;
        if (!categoryData.name) {
            res.status(400).json({
                success: false,
                message: 'Name is required'
            });
            return;
        }
        const slug = categoryData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const category = await prisma.projectCategory.create({
            data: {
                name: categoryData.name,
                nameAr: categoryData.nameAr || null,
                slug: categoryData.slug || slug,
                description: categoryData.description || '',
                descriptionAr: categoryData.descriptionAr || null,
                color: categoryData.color || '#6812F7',
                icon: categoryData.icon || '',
                featured: categoryData.featured || false,
                sortOrder: categoryData.sortOrder || 0,
                status: categoryData.status || 'active'
            }
        });
        res.status(201).json({
            success: true,
            data: { category }
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = req.body;
        const existingCategory = await prisma.projectCategory.findUnique({
            where: { id }
        });
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        let slug = existingCategory.slug;
        if (categoryData.name && categoryData.name !== existingCategory.name) {
            slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        const updateData = {};
        if (categoryData.name !== undefined)
            updateData.name = categoryData.name;
        if (categoryData.nameAr !== undefined)
            updateData.nameAr = categoryData.nameAr;
        if (categoryData.slug !== undefined)
            updateData.slug = categoryData.slug || slug;
        if (categoryData.description !== undefined)
            updateData.description = categoryData.description;
        if (categoryData.descriptionAr !== undefined)
            updateData.descriptionAr = categoryData.descriptionAr;
        if (categoryData.color !== undefined)
            updateData.color = categoryData.color;
        if (categoryData.icon !== undefined)
            updateData.icon = categoryData.icon;
        if (categoryData.featured !== undefined)
            updateData.featured = categoryData.featured;
        if (categoryData.sortOrder !== undefined)
            updateData.sortOrder = categoryData.sortOrder;
        if (categoryData.status !== undefined)
            updateData.status = categoryData.status;
        const updatedCategory = await prisma.projectCategory.update({
            where: { id },
            data: {
                ...updateData,
                slug: updateData.slug !== undefined ? updateData.slug : slug,
            }
        });
        res.json({
            success: true,
            data: { category: updatedCategory }
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingCategory = await prisma.projectCategory.findUnique({
            where: { id }
        });
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        await prisma.projectCategory.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map