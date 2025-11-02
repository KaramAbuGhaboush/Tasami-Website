import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  normalizeLocale,
  transformProjectCategoryByLocale,
  transformProjectCategoriesByLocale,
} from '../utils/localization';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all project categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: active
 *         description: Filter by category status
 *     responses:
 *       200:
 *         description: List of project categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProjectCategory'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const { featured, status = 'active' } = req.query;
    const locale = normalizeLocale(req.query.locale as string);
    
    const where: any = { status };
    if (featured !== undefined) where.featured = featured === 'true';

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
      } as any
    });

    // Transform categories based on locale
    const transformedCategories = transformProjectCategoriesByLocale(categories as any, locale);

    res.json({
      success: true,
      data: { categories: transformedCategories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single project category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/ProjectCategory'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const locale = normalizeLocale(req.query.locale as string);

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
      } as any
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    // Transform category based on locale
    const transformedCategory = transformProjectCategoryByLocale(category as any, locale);

    res.json({
      success: true,
      data: { category: transformedCategory }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new project category (Admin)
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: "Web Development"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Modern web applications and platforms"
 *               color:
 *                 type: string
 *                 description: Category color
 *                 example: "#6812F7"
 *               icon:
 *                 type: string
 *                 description: Category icon
 *                 example: "🌐"
 *               featured:
 *                 type: boolean
 *                 description: Whether category is featured
 *                 example: false
 *               sortOrder:
 *                 type: number
 *                 description: Sort order for display
 *                 example: 0
 *               status:
 *                 type: string
 *                 description: Category status
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/ProjectCategory'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Validate required fields
    if (!categoryData.name) {
      res.status(400).json({
        success: false,
        message: 'Name is required'
      });
      return;
    }

    // Generate slug from name
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
      } as any
    });

    res.status(201).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a project category (Admin)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: "Web Development"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Modern web applications and platforms"
 *               color:
 *                 type: string
 *                 description: Category color
 *                 example: "#6812F7"
 *               icon:
 *                 type: string
 *                 description: Category icon
 *                 example: "🌐"
 *               featured:
 *                 type: boolean
 *                 description: Whether category is featured
 *                 example: false
 *               sortOrder:
 *                 type: number
 *                 description: Sort order for display
 *                 example: 0
 *               status:
 *                 type: string
 *                 description: Category status
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/ProjectCategory'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    // Check if category exists
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

    // Generate slug if name changed
    let slug = existingCategory.slug;
    if (categoryData.name && categoryData.name !== existingCategory.name) {
      slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Prepare update data with Arabic fields
    const updateData: any = {};
    if (categoryData.name !== undefined) updateData.name = categoryData.name;
    if (categoryData.nameAr !== undefined) updateData.nameAr = categoryData.nameAr;
    if (categoryData.slug !== undefined) updateData.slug = categoryData.slug || slug;
    if (categoryData.description !== undefined) updateData.description = categoryData.description;
    if (categoryData.descriptionAr !== undefined) updateData.descriptionAr = categoryData.descriptionAr;
    if (categoryData.color !== undefined) updateData.color = categoryData.color;
    if (categoryData.icon !== undefined) updateData.icon = categoryData.icon;
    if (categoryData.featured !== undefined) updateData.featured = categoryData.featured;
    if (categoryData.sortOrder !== undefined) updateData.sortOrder = categoryData.sortOrder;
    if (categoryData.status !== undefined) updateData.status = categoryData.status;

    const updatedCategory = await prisma.projectCategory.update({
      where: { id },
      data: {
        ...updateData,
        slug: updateData.slug !== undefined ? updateData.slug : slug,
      } as any
    });

    res.json({
      success: true,
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a project category (Admin)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
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

    // Delete the category
    await prisma.projectCategory.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

