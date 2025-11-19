"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const upload_1 = __importDefault(require("../middleware/upload"));
const cache_1 = require("../middleware/cache");
const localization_1 = require("../utils/localization");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/articles', cache_1.cacheConfigs.blogArticles, async (req, res) => {
    try {
        const { page = 1, limit = 10, category, featured, status = 'published', locale } = req.query;
        const normalizedLocale = (0, localization_1.normalizeLocale)(locale);
        const skip = (Number(page) - 1) * Number(limit);
        const where = { status };
        if (category)
            where.category = { slug: category };
        if (featured !== undefined)
            where.featured = featured === 'true';
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
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            nameAr: true,
                            slug: true,
                            color: true
                        }
                    }
                }
            }),
            prisma.blogArticle.count({ where })
        ]);
        const transformedArticles = (0, localization_1.transformArticlesByLocale)(articles, normalizedLocale);
        const finalArticles = transformedArticles.map((article) => ({
            ...article,
            category: article.category ? (0, localization_1.transformCategoryByLocale)(article.category, normalizedLocale) : article.category,
            author: article.author ? (0, localization_1.transformAuthorByLocale)(article.author, normalizedLocale) : article.author
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
    }
    catch (error) {
        console.error('Get articles error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/articles/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { locale } = req.query;
        const normalizedLocale = (0, localization_1.normalizeLocale)(locale);
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
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
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
        let relatedArticles = [];
        if (article.relatedArticles && Array.isArray(article.relatedArticles) && article.relatedArticles.length > 0) {
            relatedArticles = await prisma.blogArticle.findMany({
                where: {
                    AND: [
                        { id: { in: article.relatedArticles } },
                        { status: 'published' }
                    ]
                },
                include: {
                    category: {
                        select: {
                            name: true,
                            nameAr: true,
                            slug: true,
                            color: true
                        }
                    }
                }
            });
        }
        else {
            relatedArticles = await prisma.blogArticle.findMany({
                where: {
                    AND: [
                        { id: { not: article.id } },
                        { status: 'published' },
                        {
                            OR: [
                                { categoryId: article.categoryId },
                            ]
                        }
                    ]
                },
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: {
                        select: {
                            name: true,
                            nameAr: true,
                            slug: true,
                            color: true
                        }
                    }
                }
            });
        }
        await prisma.blogArticle.update({
            where: { id: article.id },
            data: { views: { increment: 1 } }
        });
        const transformedArticle = (0, localization_1.transformArticleByLocale)(article, normalizedLocale);
        const transformedCategory = article.category ? (0, localization_1.transformCategoryByLocale)(article.category, normalizedLocale) : null;
        const transformedAuthor = article.author ? (0, localization_1.transformAuthorByLocale)(article.author, normalizedLocale) : null;
        const transformedRelatedArticles = relatedArticles.map((related) => {
            const transformedRelated = (0, localization_1.transformArticleByLocale)(related, normalizedLocale);
            const transformedRelatedCategory = related.category ? (0, localization_1.transformCategoryByLocale)(related.category, normalizedLocale) : null;
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
    }
    catch (error) {
        console.error('Get article error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/categories', cache_1.cacheConfigs.blogCategories, async (req, res) => {
    try {
        const { locale } = req.query;
        const normalizedLocale = (0, localization_1.normalizeLocale)(locale);
        const categories = await prisma.blogCategory.findMany({
            orderBy: { name: 'asc' }
        });
        const transformedCategories = (0, localization_1.transformCategoriesByLocale)(categories, normalizedLocale);
        return res.json({
            success: true,
            data: { categories: transformedCategories }
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/categories', async (req, res) => {
    try {
        const categoryData = req.body;
        if (!categoryData.name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }
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
            }
        });
        return res.status(201).json({
            success: true,
            data: { category }
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = req.body;
        const existingCategory = await prisma.blogCategory.findUnique({
            where: { id }
        });
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        let slug = existingCategory.slug;
        if (categoryData.name && categoryData.name !== existingCategory.name) {
            slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        const existingCategoryWithAr = existingCategory;
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
            }
        });
        return res.json({
            success: true,
            data: { category: updatedCategory }
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingCategory = await prisma.blogCategory.findUnique({
            where: { id }
        });
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        await prisma.blogCategory.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/authors', async (req, res) => {
    try {
        const authors = await prisma.blogAuthor.findMany({
            orderBy: { name: 'asc' }
        });
        return res.json({
            success: true,
            data: { authors }
        });
    }
    catch (error) {
        console.error('Get authors error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/authors', async (req, res) => {
    try {
        const authorData = req.body;
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
            }
        });
        return res.status(201).json({
            success: true,
            data: { author }
        });
    }
    catch (error) {
        console.error('Create author error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const authorData = req.body;
        const existingAuthor = await prisma.blogAuthor.findUnique({
            where: { id }
        });
        if (!existingAuthor) {
            return res.status(404).json({
                success: false,
                message: 'Author not found'
            });
        }
        const updateData = {
            ...(authorData.name !== undefined && { name: authorData.name }),
            ...(authorData.email !== undefined && { email: authorData.email }),
            ...(authorData.role !== undefined && { role: authorData.role }),
            ...(authorData.avatar !== undefined && { avatar: authorData.avatar }),
            ...(authorData.bio !== undefined && { bio: authorData.bio }),
            ...(authorData.socialLinks !== undefined && { socialLinks: authorData.socialLinks }),
            ...(authorData.expertise !== undefined && { expertise: authorData.expertise })
        };
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
    }
    catch (error) {
        console.error('Update author error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
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
        if (existingAuthor.articles && existingAuthor.articles.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete author "${existingAuthor.name}" because they have ${existingAuthor.articles.length} article(s). Please reassign or delete the articles first.`
            });
        }
        await prisma.blogAuthor.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Author deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete author error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/articles', async (req, res) => {
    try {
        const articleData = req.body;
        if (!articleData.title || !articleData.excerpt || !articleData.content) {
            return res.status(400).json({
                success: false,
                message: 'Title, excerpt, and content are required'
            });
        }
        const slug = articleData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
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
                authorId: articleData.authorId || 'cmguvvn6f0001rvckzouydzg1',
                categoryId: articleData.categoryId || 'cmguvvn6o0003rvckscjhhuvh'
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
        cache_1.invalidateCache.blog();
        return res.status(201).json({
            success: true,
            data: { article }
        });
    }
    catch (error) {
        console.error('Create article error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const articleData = req.body;
        const existingArticle = await prisma.blogArticle.findUnique({
            where: { id }
        });
        if (!existingArticle) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }
        let slug = existingArticle.slug;
        if (articleData.title && articleData.title !== existingArticle.title) {
            slug = articleData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        const readTime = typeof articleData.readTime === 'number'
            ? articleData.readTime.toString()
            : articleData.readTime || existingArticle.readTime;
        const existingArticleWithAr = existingArticle;
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
        cache_1.invalidateCache.blog();
        return res.json({
            success: true,
            data: { article: updatedArticle }
        });
    }
    catch (error) {
        console.error('Update article error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingArticle = await prisma.blogArticle.findUnique({
            where: { id }
        });
        if (!existingArticle) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }
        await prisma.blogArticle.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Article deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete article error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/upload-image', upload_1.default.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }
        const filename = req.file.filename;
        const { BACKEND_URL } = require('../config/constants');
        const imageUrl = `${BACKEND_URL}/uploads/images/${filename}`;
        return res.json({
            success: true,
            data: {
                filename: filename,
                url: imageUrl
            }
        });
    }
    catch (error) {
        console.error('Upload image error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=blog.js.map