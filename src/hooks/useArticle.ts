import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { notFound } from 'next/navigation'

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  readTime: string;
  featured: boolean;
  status: string;
  views: number;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  content: string;
  relatedArticles?: Array<{
    title: string;
    slug: string;
    category: string;
    readTime: string;
  }>;
}

export interface UseArticleReturn {
  article: Article | null;
  loading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export function useArticle(slug: string): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getBlogArticle(slug)
      if (response.success) {
        setArticle(response.data.article)
      } else {
        setError('Article not found')
        notFound()
      }
    } catch (err) {
      console.error('Error fetching article:', err)
      setError('Failed to load article')
      notFound()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchArticle()
    }
  }, [slug])

  const handleRetry = () => {
    fetchArticle()
  }

  return {
    article,
    loading,
    error,
    handleRetry
  }
}
