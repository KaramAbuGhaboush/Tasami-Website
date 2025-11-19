import { notFound } from 'next/navigation'
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

    if (!slug) {
        notFound()
    }

    let article: Article | null = null

    try {
        // Use direct fetch for SSR instead of apiClient
        const localeParam = locale === 'ar' ? 'ar' : 'en'
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.tasami.co/api';
        
        if (!apiUrl) {
            console.error('NEXT_PUBLIC_API_URL is not set')
            notFound()
        }

        const fetchUrl = `${apiUrl}/blog/articles/${slug}?locale=${localeParam}`
        console.log('Fetching article from:', fetchUrl)
        
        const response = await fetch(fetchUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('Response status:', response.status)

        if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.article) {
                article = data.data.article
                console.log('Article found:', article?.title || 'Unknown')
            } else {
                console.error('API response was not successful:', data)
            }
        } else {
            console.error('API request failed:', response.status, response.statusText)
            const errorText = await response.text().catch(() => '')
            console.error('Error response:', errorText)
        }
    } catch (error) {
        console.error('Error fetching article from backend:', error)
        // If it's a network error (backend not running), show a more helpful message
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Backend server might not be running. Please start it with: cd backend && npm run dev')
        }
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.tasami.co/api';
        const response = await fetch(`${apiUrl}/blog/articles`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
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

