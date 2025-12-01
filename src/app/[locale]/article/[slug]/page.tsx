import { notFound } from 'next/navigation'
import { ArticleComponent } from '@/components/Article'
import { Article } from '@/hooks/useArticle'
import type { Metadata } from 'next'

interface ArticlePageProps {
    params: Promise<{
        locale: string
        slug: string
    }>
}

async function fetchArticle(slug: string, locale: string): Promise<Article | null> {
    try {
        const localeParam = locale === 'ar' ? 'ar' : 'en'
        
        // For server-side rendering, use absolute URL
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN
            ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
            : process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'
        
        const apiUrl = `${baseUrl}/api/blog/articles/${slug}?locale=${localeParam}`
        
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.article) {
                return data.data.article
            }
        } else {
            console.error('Failed to fetch article:', response.status, response.statusText)
        }
    } catch (error) {
        console.error('Error fetching article:', error)
    }
    
    return null
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { locale, slug } = await params
    const article = await fetchArticle(slug, locale)
    
    if (!article) {
        return {
            title: 'Article Not Found',
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
        ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
        : 'https://www.tasami.co'
    
    const isArabic = locale === 'ar'
    const articleUrl = `${baseUrl}/${locale}/article/${slug}`
    const imageUrl = article.image && article.image.includes('.') 
        ? `${baseUrl}/uploads/images/${article.image}`
        : `${baseUrl}/Logo.png`

    return {
        title: article.title,
        description: article.excerpt || article.description || (isArabic 
            ? "مقال من تسامي"
            : "Article from Tasami"),
        keywords: article.tags && Array.isArray(article.tags) ? article.tags : [],
        authors: article.author ? [{ name: article.author.name }] : [],
        alternates: {
            canonical: articleUrl,
            languages: {
                'en': `${baseUrl}/en/article/${slug}`,
                'ar': `${baseUrl}/ar/article/${slug}`,
            },
        },
        openGraph: {
            type: 'article',
            locale: isArabic ? 'ar_SA' : 'en_US',
            url: articleUrl,
            siteName: 'Tasami',
            title: article.title,
            description: article.excerpt || article.description || '',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            publishedTime: article.createdAt,
            modifiedTime: article.updatedAt,
            authors: article.author ? [article.author.name] : [],
            section: article.category?.name || 'Blog',
            tags: article.tags && Array.isArray(article.tags) ? article.tags : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt || article.description || '',
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { locale, slug } = await params

    if (!slug) {
        notFound()
    }

    const article = await fetchArticle(slug, locale)

    if (!article) {
        notFound()
    }

    return (
        <ArticleComponent
            article={article}
            loading={false}
            error={null}
        />
    )
}

export async function generateStaticParams() {
    try {
        // For server-side rendering, use absolute URL
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN
            ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
            : process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'
        
        const apiUrl = `${baseUrl}/api/blog/articles`
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.articles) {
                return data.data.articles.map((article: Article) => ({
                    slug: article.slug,
                }))
            }
        }
    } catch (error) {
        console.error('Error fetching articles for static params:', error)
    }

    return []
}

