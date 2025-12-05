'use client'

import { useEffect, useState } from 'react'
import { ArticleComponent } from '@/components/Article'
import { Article } from '@/hooks/useArticle'
import { useLanguage } from '@/contexts/LanguageContext'
import { useParams } from 'next/navigation'

export default function ArticlePage() {
    const params = useParams()
    const slug = params?.slug as string
    const { locale } = useLanguage()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchArticle() {
            if (!slug) {
                setError('Article slug is required')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)
                
                const localeParam = locale === 'ar' ? 'ar' : 'en'
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
                        setArticle(data.data.article)
                    } else {
                        setError('Article not found')
                    }
                } else {
                    setError('Failed to load article')
                }
            } catch (err) {
                console.error('Error fetching article:', err)
                setError('Failed to load article')
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [slug, locale])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading article...</p>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                    <p className="text-gray-600">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
                </div>
            </div>
        )
    }

    return (
        <ArticleComponent
            article={article}
            loading={false}
            error={null}
        />
    )
}

