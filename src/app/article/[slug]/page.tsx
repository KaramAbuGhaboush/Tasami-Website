import { notFound } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { ArticleComponent } from '@/components/Article'
import { Article } from '@/hooks/useArticle'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  let article: Article | null = null
  
  try {
    const response = await apiClient.getBlogArticle(slug)
    if (response.success) {
      article = response.data.article
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
      handleRetry={() => {}}
    />
  )
}

export async function generateStaticParams() {
  try {
    const response = await apiClient.getBlogArticles()
    if (response.success) {
      return response.data.articles.map((article: Article) => ({
        slug: article.slug,
      }))
    }
  } catch (error) {
    console.error('Error fetching articles for static params:', error)
  }
  
  return []
}
