import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { featured, status = 'active' } = req.query;
    
    const where: any = { status };
    if (featured !== undefined) where.featured = featured === 'true';

    const categories = await prisma.projectCategory.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.projectCategory.findUnique({
      where: { id }
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create category (admin)
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
        slug: categoryData.slug || slug,
        description: categoryData.description || '',
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
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update category (admin)
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

    const updatedCategory = await prisma.projectCategory.update({
      where: { id },
      data: {
        name: categoryData.name || existingCategory.name,
        slug: categoryData.slug || slug,
        description: categoryData.description || existingCategory.description,
        color: categoryData.color || existingCategory.color,
        icon: categoryData.icon || existingCategory.icon,
        featured: categoryData.featured !== undefined ? categoryData.featured : existingCategory.featured,
        sortOrder: categoryData.sortOrder !== undefined ? categoryData.sortOrder : existingCategory.sortOrder,
        status: categoryData.status || existingCategory.status
      }
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

// Delete category (admin)
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

