import { notFound } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { ArticleComponent } from '@/components/Article'
import { Article } from '@/hooks/useArticle'

interface ArticlePageProps {
    params: Promise<{
        locale: string
        slug: string
    }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { locale, slug } = await params

    let article: Article | null = null

    try {
        // Use direct fetch for SSR instead of apiClient
        const localeParam = locale === 'ar' ? 'ar' : 'en'
        const response = await fetch(`http://localhost:3002/api/blog/articles/${slug}?locale=${localeParam}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success) {
                article = data.data.article
            }
        }
    } catch (error) {
        console.error('Error fetching article from backend:', error)
    }

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
        // Use direct fetch for SSR instead of apiClient
        const response = await fetch('http://localhost:3002/api/blog/articles', {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success) {
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

