/**
 * Blog Service Layer
 * Handles all blog-related business logic
 */

import { prisma } from '@/lib/prisma'
import { blogArticleSchema, blogCategorySchema, blogAuthorSchema } from '@/lib/validation'
import { z } from 'zod'
import {
  transformArticlesByLocale,
  transformArticleByLocale,
  transformCategoryByLocale,
  transformAuthorByLocale,
  normalizeLocale,
} from '@/server/utils/localization'

export interface GetArticlesParams {
  page?: number
  limit?: number
  category?: string
  featured?: boolean
  status?: string
  locale?: string
}

export interface CreateArticleData extends z.infer<typeof blogArticleSchema> {}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export class BlogService {
  /**
   * Get all articles with pagination and filters
   */
  static async getArticles(params: GetArticlesParams = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      status = 'published',
      locale = 'en',
    } = params

    const skip = (page - 1) * limit
    const normalizedLocale = normalizeLocale(locale)

    const where: any = {}
    // Only filter by status if it's not 'all'
    if (status !== 'all') {
      where.status = status
    }
    if (category) where.category = { slug: category }
    if (featured !== undefined) where.featured = featured === true

    console.log('[BlogService.getArticles] Query params:', { status, page, limit, category, featured })
    console.log('[BlogService.getArticles] Where clause:', JSON.stringify(where, null, 2))

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          titleAr: true,
          excerpt: true,
          excerptAr: true,
          content: true,
          contentAr: true,
          slug: true,
          image: true,
          readTime: true,
          featured: true,
          status: true,
          views: true,
          tags: true,
          relatedArticles: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              avatar: true,
              role: true,
              roleAr: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              slug: true,
              color: true,
            },
          },
        },
      }),
      prisma.blogArticle.count({ where }),
    ])

    console.log('[BlogService.getArticles] Found articles:', articles.length, 'Total:', total)

    // Transform articles based on locale
    const transformedArticles = transformArticlesByLocale(articles, normalizedLocale)
    const finalArticles = transformedArticles.map((article: any) => ({
      ...article,
      category: article.category
        ? transformCategoryByLocale(article.category, normalizedLocale)
        : article.category,
      author: article.author
        ? transformAuthorByLocale(article.author, normalizedLocale)
        : article.author,
    }))

    return {
      articles: finalArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get article by slug
   */
  static async getArticleBySlug(slug: string, locale: string = 'en') {
    const normalizedLocale = normalizeLocale(locale)

    const article = await prisma.blogArticle.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        titleAr: true,
        excerpt: true,
        excerptAr: true,
        content: true,
        contentAr: true,
        slug: true,
        image: true,
        readTime: true,
        featured: true,
        status: true,
        views: true,
        tags: true,
        relatedArticles: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            role: true,
            roleAr: true,
            email: true,
            avatar: true,
            bio: true,
            bioAr: true,
            socialLinks: true,
            expertise: true,
          },
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
          },
        },
      },
    })

    if (!article) {
      return null
    }

    // Increment views
    await prisma.blogArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    })

    // Transform based on locale
    const transformedArticle = transformArticleByLocale(article, normalizedLocale)
    transformedArticle.category = article.category
      ? transformCategoryByLocale(article.category, normalizedLocale)
      : article.category
    transformedArticle.author = article.author
      ? transformAuthorByLocale(article.author, normalizedLocale)
      : article.author

    return transformedArticle
  }

  /**
   * Generate a URL-friendly slug from a string
   */
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Create article
   */
  static async createArticle(data: CreateArticleData) {
    const validatedData = blogArticleSchema.parse(data)

    const { authorId, categoryId, seoTitle, seoDescription, ...createData } = validatedData
    const createPayload: any = { ...createData }

    // Generate slug from title if not provided
    if (!createPayload.slug && createPayload.title) {
      let baseSlug = this.generateSlug(createPayload.title)
      let slug = baseSlug
      let counter = 1

      // Ensure slug is unique
      while (await prisma.blogArticle.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      createPayload.slug = slug
    }

    if (authorId) {
      createPayload.author = {
        connect: { id: authorId },
      }
    }

    if (categoryId) {
      createPayload.category = {
        connect: { id: categoryId },
      }
    }

    const article = await prisma.blogArticle.create({
      data: createPayload,
      include: {
        author: true,
        category: true,
      },
    })

    return article
  }

  /**
   * Update article
   */
  static async updateArticle(slugOrId: string, data: UpdateArticleData) {
    // Try to find by slug first, then by ID
    let article = await prisma.blogArticle.findUnique({
      where: { slug: slugOrId },
    })

    if (!article) {
      article = await prisma.blogArticle.findUnique({
        where: { id: slugOrId },
      })
    }

    if (!article) {
      throw new Error('Article not found')
    }

    const validatedData = blogArticleSchema.partial().parse(data)
    const { authorId, categoryId, seoTitle, seoDescription, ...updateData } = validatedData
    const updatePayload: any = { ...updateData }

    if (authorId) {
      updatePayload.author = {
        connect: { id: authorId },
      }
    }

    if (categoryId) {
      updatePayload.category = {
        connect: { id: categoryId },
      }
    }

    const updatedArticle = await prisma.blogArticle.update({
      where: { id: article.id },
      data: updatePayload,
      include: {
        author: true,
        category: true,
      },
    })

    return updatedArticle
  }

  /**
   * Delete article
   */
  static async deleteArticle(slugOrId: string) {
    // Try to find by slug first, then by ID
    let article = await prisma.blogArticle.findUnique({
      where: { slug: slugOrId },
    })

    if (!article) {
      article = await prisma.blogArticle.findUnique({
        where: { id: slugOrId },
      })
    }

    if (!article) {
      throw new Error('Article not found')
    }

    await prisma.blogArticle.delete({
      where: { id: article.id },
    })

    return { success: true }
  }
}

