import express from 'express';
import { PrismaClient } from '@prisma/client';
import upload from '../middleware/upload';
import path from 'path';
import { cacheConfigs, invalidateCache } from '../middleware/cache';
import {
  transformArticleByLocale,
  transformArticlesByLocale,
  transformCategoryByLocale,
  transformCategoriesByLocale,
  transformAuthorByLocale,
  normalizeLocale
} from '../utils/localization';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /blog/articles:
 *   get:
 *     summary: Get all blog articles
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of articles per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: published
 *         description: Filter by article status
 *     responses:
 *       200:
 *         description: List of blog articles
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
 *                     articles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BlogArticle'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/articles', cacheConfigs.blogArticles, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured, status = 'published', locale } = req.query;
    const normalizedLocale = normalizeLocale(locale as string);
    
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
              nameAr: true,
              avatar: true,
              role: true,
              roleAr: true
            } as any
          },
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              slug: true,
              color: true
            } as any
          }
        }
      }),
      prisma.blogArticle.count({ where })
    ]);

    // Transform articles, categories, and authors based on locale
    const transformedArticles = transformArticlesByLocale(articles, normalizedLocale);
    // Also transform category and author in each article
    const finalArticles = transformedArticles.map((article: any) => ({
      ...article,
      category: article.category ? transformCategoryByLocale(article.category, normalizedLocale) : article.category,
      author: article.author ? transformAuthorByLocale(article.author, normalizedLocale) : article.author
    }));

    return res.json({
      success: true,
      data: {
        articles: finalArticles,
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

/**
 * @swagger
 * /blog/articles/{slug}:
 *   get:
 *     summary: Get a single article by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Article slug
 *     responses:
 *       200:
 *         description: Article details
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
 *                     article:
 *                       $ref: '#/components/schemas/BlogArticle'
 *       404:
 *         description: Article not found
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
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;
    const normalizedLocale = normalizeLocale(locale as string);

    const article = await prisma.blogArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            avatar: true,
            role: true,
            roleAr: true,
            bio: true,
            bioAr: true
          } as any
        },
        category: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            slug: true,
            color: true
          } as any
        }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Fetch related articles based on stored relatedArticles IDs
    let relatedArticles = [];
    if (article.relatedArticles && Array.isArray(article.relatedArticles) && article.relatedArticles.length > 0) {
      relatedArticles = await prisma.blogArticle.findMany({
        where: {
          AND: [
            { id: { in: article.relatedArticles as string[] } }, // Only articles with stored IDs
            { status: 'published' } // Only published articles
          ]
        },
        include: {
          category: {
            select: {
              name: true,
              nameAr: true,
              slug: true,
              color: true
            } as any
          }
        }
      });
    } else {
      // Fallback: Fetch related articles based on category and tags if no stored relatedArticles
      relatedArticles = await prisma.blogArticle.findMany({
        where: {
          AND: [
            { id: { not: article.id } }, // Exclude current article
            { status: 'published' }, // Only published articles
            {
              OR: [
                { categoryId: article.categoryId }, // Same category
                // For tags, we'll use a different approach since array_contains might not be available
                // We'll filter by category for now and can enhance tag matching later
              ]
            }
          ]
        },
        take: 3, // Limit to 3 related articles
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: {
              name: true,
              nameAr: true,
              slug: true,
              color: true
            } as any
          }
        }
      });
    }

    // Increment view count
    await prisma.blogArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    // Transform article, category, and author based on locale
    const transformedArticle = transformArticleByLocale(article as any, normalizedLocale);
    const transformedCategory = (article as any).category ? transformCategoryByLocale((article as any).category, normalizedLocale) : null;
    const transformedAuthor = (article as any).author ? transformAuthorByLocale((article as any).author, normalizedLocale) : null;

    // Transform related articles
    const transformedRelatedArticles = relatedArticles.map((related: any) => {
      const transformedRelated = transformArticleByLocale(related, normalizedLocale);
      const transformedRelatedCategory = related.category ? transformCategoryByLocale(related.category, normalizedLocale) : null;
      return {
        title: transformedRelated.title,
        slug: transformedRelated.slug,
        category: transformedRelatedCategory?.name || 'Uncategorized',
        readTime: transformedRelated.readTime,
        excerpt: transformedRelated.excerpt,
        image: transformedRelated.image,
        createdAt: transformedRelated.createdAt
      };
    });

    // Add related articles to the article object
    const articleWithRelated = {
      ...transformedArticle,
      category: transformedCategory,
      author: transformedAuthor,
      relatedArticles: transformedRelatedArticles
    };

    return res.json({
      success: true,
      data: { article: articleWithRelated }
    });
  } catch (error) {
    console.error('Get article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /blog/categories:
 *   get:
 *     summary: Get all blog categories
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blog categories
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
 *                         $ref: '#/components/schemas/BlogCategory'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categories', cacheConfigs.blogCategories, async (req, res) => {
  try {
    const { locale } = req.query;
    const normalizedLocale = normalizeLocale(locale as string);

    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    });

    // Transform categories based on locale
    const transformedCategories = transformCategoriesByLocale(categories, normalizedLocale);

    return res.json({
      success: true,
      data: { categories: transformedCategories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /blog/categories:
 *   post:
 *     summary: Create a new blog category (Admin)
 *     tags: [Blog]
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
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Articles about technology trends"
 *               color:
 *                 type: string
 *                 description: Category color
 *                 example: "#6812F7"
 *               icon:
 *                 type: string
 *                 description: Category icon
 *                 example: "📱"
 *               featured:
 *                 type: boolean
 *                 description: Whether category is featured
 *                 example: false
 *               seoTitle:
 *                 type: string
 *                 description: SEO title
 *                 example: "Technology Articles"
 *               seoDescription:
 *                 type: string
 *                 description: SEO description
 *                 example: "Latest technology trends and insights"
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
 *                       $ref: '#/components/schemas/BlogCategory'
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
        nameAr: categoryData.nameAr || null,
        slug: slug,
        description: categoryData.description || '',
        descriptionAr: categoryData.descriptionAr || null,
        color: categoryData.color || '#6812F7',
        icon: categoryData.icon || '📝',
        featured: categoryData.featured || false,
        seoTitle: categoryData.seoTitle || categoryData.name,
        seoTitleAr: categoryData.seoTitleAr || null,
        seoDescription: categoryData.seoDescription || categoryData.description || '',
        seoDescriptionAr: categoryData.seoDescriptionAr || null
      } as any
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

/**
 * @swagger
 * /blog/categories/{id}:
 *   put:
 *     summary: Update a blog category (Admin)
 *     tags: [Blog]
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
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Articles about technology trends"
 *               color:
 *                 type: string
 *                 description: Category color
 *                 example: "#6812F7"
 *               icon:
 *                 type: string
 *                 description: Category icon
 *                 example: "📱"
 *               featured:
 *                 type: boolean
 *                 description: Whether category is featured
 *                 example: false
 *               seoTitle:
 *                 type: string
 *                 description: SEO title
 *                 example: "Technology Articles"
 *               seoDescription:
 *                 type: string
 *                 description: SEO description
 *                 example: "Latest technology trends and insights"
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
 *                       $ref: '#/components/schemas/BlogCategory'
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

    const existingCategoryWithAr = existingCategory as any;
    const updatedCategory = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: categoryData.name || existingCategory.name,
        nameAr: categoryData.nameAr !== undefined ? categoryData.nameAr : existingCategoryWithAr.nameAr,
        slug: slug,
        description: categoryData.description || existingCategory.description,
        descriptionAr: categoryData.descriptionAr !== undefined ? categoryData.descriptionAr : existingCategoryWithAr.descriptionAr,
        color: categoryData.color || existingCategory.color,
        icon: categoryData.icon || existingCategory.icon,
        featured: categoryData.featured !== undefined ? categoryData.featured : existingCategory.featured,
        seoTitle: categoryData.seoTitle || existingCategory.seoTitle,
        seoTitleAr: categoryData.seoTitleAr !== undefined ? categoryData.seoTitleAr : existingCategoryWithAr.seoTitleAr,
        seoDescription: categoryData.seoDescription || existingCategory.seoDescription,
        seoDescriptionAr: categoryData.seoDescriptionAr !== undefined ? categoryData.seoDescriptionAr : existingCategoryWithAr.seoDescriptionAr
      } as any
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

/**
 * @swagger
 * /blog/categories/{id}:
 *   delete:
 *     summary: Delete a blog category (Admin)
 *     tags: [Blog]
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
/**
 * @swagger
 * /blog/authors:
 *   get:
 *     summary: Get all blog authors
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blog authors
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
 *                     authors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BlogAuthor'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /blog/authors:
 *   post:
 *     summary: Create a new blog author (Admin)
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Author name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Author email
 *                 example: "john@example.com"
 *               role:
 *                 type: string
 *                 description: Author role
 *                 example: "Senior Writer"
 *               avatar:
 *                 type: string
 *                 description: Author avatar
 *                 example: "👨‍💻"
 *               bio:
 *                 type: string
 *                 description: Author biography
 *                 example: "Technology writer with 10 years experience"
 *               socialLinks:
 *                 type: object
 *                 description: Social media links
 *                 example: {"twitter": "@johndoe", "linkedin": "johndoe"}
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Areas of expertise
 *                 example: ["JavaScript", "React", "Node.js"]
 *     responses:
 *       201:
 *         description: Author created successfully
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
 *                     author:
 *                       $ref: '#/components/schemas/BlogAuthor'
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
        nameAr: authorData.nameAr || null,
        email: authorData.email,
        role: authorData.role || 'Author',
        roleAr: authorData.roleAr || null,
        avatar: authorData.avatar || '👤',
        bio: authorData.bio || '',
        bioAr: authorData.bioAr || null,
        socialLinks: authorData.socialLinks || {},
        expertise: authorData.expertise || [],
        joinDate: new Date().toISOString()
      } as any
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

/**
 * @swagger
 * /blog/authors/{id}:
 *   put:
 *     summary: Update a blog author (Admin)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Author name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Author email
 *                 example: "john@example.com"
 *               role:
 *                 type: string
 *                 description: Author role
 *                 example: "Senior Writer"
 *               avatar:
 *                 type: string
 *                 description: Author avatar
 *                 example: "👨‍💻"
 *               bio:
 *                 type: string
 *                 description: Author biography
 *                 example: "Technology writer with 10 years experience"
 *               socialLinks:
 *                 type: object
 *                 description: Social media links
 *                 example: {"twitter": "@johndoe", "linkedin": "johndoe"}
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Areas of expertise
 *                 example: ["JavaScript", "React", "Node.js"]
 *     responses:
 *       200:
 *         description: Author updated successfully
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
 *                     author:
 *                       $ref: '#/components/schemas/BlogAuthor'
 *       404:
 *         description: Author not found
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

    const updateData: any = {
      ...(authorData.name !== undefined && { name: authorData.name }),
      ...(authorData.email !== undefined && { email: authorData.email }),
      ...(authorData.role !== undefined && { role: authorData.role }),
      ...(authorData.avatar !== undefined && { avatar: authorData.avatar }),
      ...(authorData.bio !== undefined && { bio: authorData.bio }),
      ...(authorData.socialLinks !== undefined && { socialLinks: authorData.socialLinks }),
      ...(authorData.expertise !== undefined && { expertise: authorData.expertise })
    };

    // Handle Arabic fields
    if (authorData.nameAr !== undefined) {
      updateData.nameAr = authorData.nameAr || null;
    }
    if (authorData.roleAr !== undefined) {
      updateData.roleAr = authorData.roleAr || null;
    }
    if (authorData.bioAr !== undefined) {
      updateData.bioAr = authorData.bioAr || null;
    }

    const updatedAuthor = await prisma.blogAuthor.update({
      where: { id },
      data: updateData
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

/**
 * @swagger
 * /blog/authors/{id}:
 *   delete:
 *     summary: Delete a blog author (Admin)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
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
 *                   example: "Author deleted successfully"
 *       404:
 *         description: Author not found
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
router.delete('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if author exists
    const existingAuthor = await prisma.blogAuthor.findUnique({
      where: { id },
      include: {
        articles: true
      }
    });

    if (!existingAuthor) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Check if author has articles
    if (existingAuthor.articles && existingAuthor.articles.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete author "${existingAuthor.name}" because they have ${existingAuthor.articles.length} article(s). Please reassign or delete the articles first.`
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

/**
 * @swagger
 * /blog/articles:
 *   post:
 *     summary: Create a new blog article (Admin)
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - excerpt
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Article title
 *                 example: "Getting Started with React"
 *               excerpt:
 *                 type: string
 *                 description: Article excerpt
 *                 example: "Learn the basics of React development"
 *               content:
 *                 type: string
 *                 description: Article content
 *                 example: "<p>React is a JavaScript library...</p>"
 *               image:
 *                 type: string
 *                 description: Article image URL
 *                 example: "https://example.com/image.jpg"
 *               readTime:
 *                 type: string
 *                 description: Estimated read time
 *                 example: "5 min read"
 *               featured:
 *                 type: boolean
 *                 description: Whether article is featured
 *                 example: false
 *               status:
 *                 type: string
 *                 description: Article status
 *                 example: "draft"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Article tags
 *                 example: ["React", "JavaScript", "Frontend"]
 *               authorId:
 *                 type: string
 *                 description: Author ID
 *                 example: "cmguvvn6f0001rvckzouydzg1"
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *                 example: "cmguvvn6o0003rvckscjhhuvh"
 *     responses:
 *       201:
 *         description: Article created successfully
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
 *                     article:
 *                       $ref: '#/components/schemas/BlogArticle'
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
        titleAr: articleData.titleAr || null,
        excerpt: articleData.excerpt,
        excerptAr: articleData.excerptAr || null,
        content: articleData.content,
        contentAr: articleData.contentAr || null,
        slug: slug,
        image: articleData.image,
        readTime: readTime,
        featured: articleData.featured || false,
        status: articleData.status || 'draft',
        views: 0,
        tags: articleData.tags || [],
        relatedArticles: articleData.relatedArticles || [],
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

    // Invalidate blog cache after creating new article
    invalidateCache.blog();

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

/**
 * @swagger
 * /blog/articles/{id}:
 *   put:
 *     summary: Update a blog article (Admin)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Article title
 *                 example: "Getting Started with React"
 *               excerpt:
 *                 type: string
 *                 description: Article excerpt
 *                 example: "Learn the basics of React development"
 *               content:
 *                 type: string
 *                 description: Article content
 *                 example: "<p>React is a JavaScript library...</p>"
 *               image:
 *                 type: string
 *                 description: Article image URL
 *                 example: "https://example.com/image.jpg"
 *               readTime:
 *                 type: string
 *                 description: Estimated read time
 *                 example: "5 min read"
 *               featured:
 *                 type: boolean
 *                 description: Whether article is featured
 *                 example: false
 *               status:
 *                 type: string
 *                 description: Article status
 *                 example: "published"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Article tags
 *                 example: ["React", "JavaScript", "Frontend"]
 *               authorId:
 *                 type: string
 *                 description: Author ID
 *                 example: "cmguvvn6f0001rvckzouydzg1"
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *                 example: "cmguvvn6o0003rvckscjhhuvh"
 *     responses:
 *       200:
 *         description: Article updated successfully
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
 *                     article:
 *                       $ref: '#/components/schemas/BlogArticle'
 *       404:
 *         description: Article not found
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

    const existingArticleWithAr = existingArticle as any;
    const updatedArticle = await prisma.blogArticle.update({
      where: { id },
      data: {
        title: articleData.title || existingArticle.title,
        titleAr: articleData.titleAr !== undefined ? articleData.titleAr : existingArticleWithAr.titleAr,
        excerpt: articleData.excerpt || existingArticle.excerpt,
        excerptAr: articleData.excerptAr !== undefined ? articleData.excerptAr : existingArticleWithAr.excerptAr,
        content: articleData.content || existingArticle.content,
        contentAr: articleData.contentAr !== undefined ? articleData.contentAr : existingArticleWithAr.contentAr,
        slug: slug,
        image: articleData.image || existingArticle.image,
        readTime: readTime,
        featured: articleData.featured !== undefined ? articleData.featured : existingArticle.featured,
        status: articleData.status || existingArticle.status,
        tags: articleData.tags || existingArticle.tags,
        relatedArticles: articleData.relatedArticles !== undefined ? articleData.relatedArticles : existingArticle.relatedArticles,
        authorId: articleData.authorId || existingArticle.authorId,
        categoryId: articleData.categoryId || existingArticle.categoryId
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

    // Invalidate blog cache after updating article
    invalidateCache.blog();

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

/**
 * @swagger
 * /blog/articles/{id}:
 *   delete:
 *     summary: Delete a blog article (Admin)
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
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
 *                   example: "Article deleted successfully"
 *       404:
 *         description: Article not found
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

/**
 * @swagger
 * /blog/upload-image:
 *   post:
 *     summary: Upload an image for blog articles (Admin)
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                     filename:
 *                       type: string
 *                       example: "blog-1234567890-123456789.jpg"
 *                     url:
 *                       type: string
 *                       example: "http://localhost:3002/uploads/images/blog-1234567890-123456789.jpg"
 *       400:
 *         description: Bad request - no file uploaded
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
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const filename = req.file.filename;
    const imageUrl = `http://localhost:3002/uploads/images/${filename}`;

    return res.json({
      success: true,
      data: {
        filename: filename,
        url: imageUrl
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;