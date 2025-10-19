import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all articles (public)
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured, status = 'published' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = { status };
    if (category) where.category = { slug: category };
    if (featured !== undefined) where.featured = featured === 'true';

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          }
        }
      }),
      prisma.blogArticle.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single article (public)
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.blogArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment view count
    await prisma.blogArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    return res.json({
      success: true,
      data: { article }
    });
  } catch (error) {
    console.error('Get article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get categories (public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    });

    return res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create category (admin)
router.post('/categories', async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Validate required fields
    if (!categoryData.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const category = await prisma.blogCategory.create({
      data: {
        name: categoryData.name,
        slug: slug,
        description: categoryData.description || '',
        color: categoryData.color || '#6812F7',
        icon: categoryData.icon || '📝',
        featured: categoryData.featured || false,
        seoTitle: categoryData.seoTitle || categoryData.name,
        seoDescription: categoryData.seoDescription || categoryData.description || ''
      }
    });

    return res.status(201).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update category (admin)
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    
    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (categoryData.name && categoryData.name !== existingCategory.name) {
      slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updatedCategory = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: categoryData.name || existingCategory.name,
        slug: slug,
        description: categoryData.description || existingCategory.description,
        color: categoryData.color || existingCategory.color,
        icon: categoryData.icon || existingCategory.icon,
        featured: categoryData.featured !== undefined ? categoryData.featured : existingCategory.featured,
        seoTitle: categoryData.seoTitle || existingCategory.seoTitle,
        seoDescription: categoryData.seoDescription || existingCategory.seoDescription
      }
    });

    return res.json({
      success: true,
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete category (admin)
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete the category
    await prisma.blogCategory.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get authors (public)
router.get('/authors', async (req, res) => {
  try {
    const authors = await prisma.blogAuthor.findMany({
      orderBy: { name: 'asc' }
    });

    return res.json({
      success: true,
      data: { authors }
    });
  } catch (error) {
    console.error('Get authors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create author (admin)
router.post('/authors', async (req, res) => {
  try {
    const authorData = req.body;
    
    // Validate required fields
    if (!authorData.name || !authorData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    const author = await prisma.blogAuthor.create({
      data: {
        name: authorData.name,
        email: authorData.email,
        role: authorData.role || 'Author',
        avatar: authorData.avatar || '👤',
        bio: authorData.bio || '',
        socialLinks: authorData.socialLinks || {},
        expertise: authorData.expertise || [],
        joinDate: new Date().toISOString()
      }
    });

    return res.status(201).json({
      success: true,
      data: { author }
    });
  } catch (error) {
    console.error('Create author error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update author (admin)
router.put('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authorData = req.body;
    
    // Check if author exists
    const existingAuthor = await prisma.blogAuthor.findUnique({
      where: { id }
    });

    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    const updatedAuthor = await prisma.blogAuthor.update({
      where: { id },
      data: {
        name: authorData.name || existingAuthor.name,
        email: authorData.email || existingAuthor.email,
        role: authorData.role || existingAuthor.role,
        avatar: authorData.avatar || existingAuthor.avatar,
        bio: authorData.bio || existingAuthor.bio,
        socialLinks: authorData.socialLinks || existingAuthor.socialLinks,
        expertise: authorData.expertise || existingAuthor.expertise
      }
    });

    return res.json({
      success: true,
      data: { author: updatedAuthor }
    });
  } catch (error) {
    console.error('Update author error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete author (admin)
router.delete('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if author exists
    const existingAuthor = await prisma.blogAuthor.findUnique({
      where: { id }
    });

    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Delete the author
    await prisma.blogAuthor.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Author deleted successfully'
    });
  } catch (error) {
    console.error('Delete author error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create article (admin)
router.post('/articles', async (req, res) => {
  try {
    const articleData = req.body;
    
    // Validate required fields
    if (!articleData.title || !articleData.excerpt || !articleData.content) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, and content are required'
      });
    }
    
    // Generate slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Convert readTime to string if it's a number
    const readTime = typeof articleData.readTime === 'number' 
      ? articleData.readTime.toString() 
      : articleData.readTime || '5';
    
    const article = await prisma.blogArticle.create({
      data: {
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        slug: slug,
        image: articleData.image,
        readTime: readTime,
        featured: articleData.featured || false,
        status: articleData.status || 'draft',
        views: 0,
        tags: articleData.tags || [],
        relatedArticles: [],
        authorId: articleData.authorId || 'cmguvvn6f0001rvckzouydzg1', // Default author
        categoryId: articleData.categoryId || 'cmguvvn6o0003rvckscjhhuvh' // Default category
      } as any,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: { article }
    });
  } catch (error) {
    console.error('Create article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update article (admin)
router.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = req.body;
    
    // Check if article exists
    const existingArticle = await prisma.blogArticle.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (articleData.title && articleData.title !== existingArticle.title) {
      slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Convert readTime to string if it's a number
    const readTime = typeof articleData.readTime === 'number' 
      ? articleData.readTime.toString() 
      : articleData.readTime || existingArticle.readTime;

    const updatedArticle = await prisma.blogArticle.update({
      where: { id },
      data: {
        title: articleData.title || existingArticle.title,
        excerpt: articleData.excerpt || existingArticle.excerpt,
        content: articleData.content || existingArticle.content,
        slug: slug,
        image: articleData.image || existingArticle.image,
        readTime: readTime,
        featured: articleData.featured !== undefined ? articleData.featured : existingArticle.featured,
        status: articleData.status || existingArticle.status,
        tags: articleData.tags || existingArticle.tags,
        authorId: articleData.authorId || existingArticle.authorId,
        categoryId: articleData.categoryId || existingArticle.categoryId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    });

    return res.json({
      success: true,
      data: { article: updatedArticle }
    });
  } catch (error) {
    console.error('Update article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete article (admin)
router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if article exists
    const existingArticle = await prisma.blogArticle.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Delete the article
    await prisma.blogArticle.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;