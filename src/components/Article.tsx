'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLanguage } from '@/contexts/LanguageContext'
import { Article } from '@/hooks/useArticle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useState, useEffect, memo } from 'react'
import OptimizedImage from '@/components/OptimizedImage'
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/structured-data'
import { SkeletonArticleContent, SkeletonShimmer } from '@/components/ui/skeleton'

// Helper function to get the correct image source
const getImageSrc = (image: string) => {
  if (!image) return null;

  // If it's a full URL (http, https, or blob), return as is
  if (image.startsWith('http') || image.startsWith('blob:')) {
    return image;
  }

  // If it's a base64 image, return as is
  if (image.startsWith('data:image/')) {
    return image;
  }

  // If it's a filename (contains extension), construct the full URL
  if (image.includes('.') && image.length > 10) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.tasami.co/api';
    return `${apiUrl.replace('/api', '')}/uploads/images/${image}`;
  }

  // For anything else (like emojis), return null to show as emoji
  return null;
};

interface ArticleProps {
  article: Article;
  loading: boolean;
  error: string | null;
  handleRetry?: () => void;
}

export const ArticleComponent = memo(function ArticleComponent({ article, loading, error, handleRetry }: ArticleProps) {
  const t = useTranslations('blog')
  const tCommon = useTranslations('common')
  const { locale, direction } = useLanguage()
  const isRTL = direction === 'rtl'
  const [formattedDate, setFormattedDate] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  // Format readTime for display based on locale
  const formatReadTime = (readTime: string) => {
    if (!readTime) return readTime

    // If readTime contains "min read" or similar, format it based on locale
    if (readTime.includes('min') || readTime.includes('دقيقة')) {
      if (isRTL) {
        // For Arabic: extract number and format as "4 min read" -> "4 دقيقة قراءة"
        const match = readTime.match(/(\d+)\s*(?:min|دقيقة)/i)
        if (match) {
          const minutes = match[1]
          return `${minutes} دقيقة قراءة`
        }
        // If already in Arabic format, return as is
        return readTime
      } else {
        // For English: ensure format is "4 min read"
        const match = readTime.match(/(\d+)\s*(?:min|دقيقة)/i)
        if (match) {
          const minutes = match[1]
          return `${minutes} min read`
        }
        return readTime
      }
    }

    return readTime
  }

  useEffect(() => {
    setIsMounted(true)
    const date = new Date(article.createdAt)
    const formatted = date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    setFormattedDate(formatted)
  }, [article.createdAt, locale])

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Article Header Skeleton */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Skeleton */}
            <nav className="mb-8">
              <div className="flex items-center space-x-2">
                <SkeletonShimmer className="h-4 w-16 rounded" />
                <SkeletonShimmer className="h-4 w-4 rounded" />
                <SkeletonShimmer className="h-4 w-16 rounded" />
                <SkeletonShimmer className="h-4 w-4 rounded" />
                <SkeletonShimmer className="h-4 w-24 rounded" />
              </div>
            </nav>

            {/* Article Meta Skeleton */}
            <div className="flex items-center space-x-4 mb-6">
              <SkeletonShimmer className="h-4 w-20 rounded" />
              <SkeletonShimmer className="h-4 w-4 rounded-full" />
              <SkeletonShimmer className="h-4 w-24 rounded" />
              <SkeletonShimmer className="h-4 w-4 rounded-full" />
              <SkeletonShimmer className="h-6 w-24 rounded-full" />
            </div>

            {/* Article Title Skeleton */}
            <SkeletonShimmer className="h-12 w-full rounded mb-6" />
            <SkeletonShimmer className="h-8 w-5/6 rounded mb-8" />

            {/* Author Info Skeleton */}
            <div className="flex items-center space-x-4 mb-12">
              <SkeletonShimmer className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <SkeletonShimmer className="h-5 w-32 rounded" />
                <SkeletonShimmer className="h-4 w-24 rounded" />
              </div>
            </div>

            {/* Article Image Skeleton */}
            <SkeletonShimmer className="aspect-video w-full rounded-3xl" />
          </div>
        </section>

        {/* Article Content Skeleton */}
        <section className="pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SkeletonArticleContent />
          </div>
        </section>

        {/* Tags Skeleton */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonShimmer key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">{t('errorLoadingArticle')}</h3>
            <p className="text-red-600 mb-4">{error}</p>
            {handleRetry && (
              <button
                onClick={handleRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('tryAgain')}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('articleNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('articleNotFoundDescription')}</p>
          <Link
            href="/blog"
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#5a0fd4] transition-colors"
          >
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
    : 'https://www.tasami.co'

  // Generate structured data
  const articleStructuredData = generateArticleStructuredData(
    {
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: article.author,
      slug: article.slug || '',
    },
    baseUrl,
    locale
  )

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(
    [
      { name: tCommon('home'), url: '/' },
      { name: tCommon('blog'), url: '/blog' },
      { name: article.category.name, url: `/blog?category=${article.category.slug || ''}` },
      { name: article.title, url: `/article/${article.slug}` },
    ],
    baseUrl
  )

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Article Header */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex items-center justify-start ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-sm text-gray-500`}>
              <Link href="/" className="hover:text-[#6812F7] transition-colors">{tCommon('home')}</Link>
              <span>{isRTL ? '›' : '›'}</span>
              <Link href="/blog" className="hover:text-[#6812F7] transition-colors">{tCommon('blog')}</Link>
              <span>{isRTL ? '›' : '›'}</span>
              <span className="text-gray-900">{article.category.name}</span>
            </div>
          </nav>

          {/* Article Meta */}
          <div className={`flex items-center justify-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} text-sm text-gray-500 mb-6`} dir={isRTL ? 'rtl' : 'ltr'}>

            <span className="bg-[#6812F7] text-white px-3 py-1 rounded-full text-xs font-semibold">
              {article.category.name}
            </span>
            <span>•</span>
            <span suppressHydrationWarning>{isMounted ? formattedDate : ''}</span>
            <span>•</span>
            <span>{formatReadTime(article.readTime)}</span>
          </div>

          {/* Article Title */}
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {article.title}
          </h1>

          {/* Article Excerpt */}
          <p className={`text-xl text-gray-600 leading-relaxed mb-8 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {article.excerpt}
          </p>

          {/* Author Info */}
          <div className={`flex items-center ${isRTL ? 'flex-row space-x-reverse space-x-4' : 'space-x-4'} mb-12`}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center text-2xl">
              {article.author.avatar}
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {article.author.name}
              </h3>
              <p className={`text-gray-600 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {article.author.role}
              </p>
              {article.author.bio && (
                <p className={`text-sm text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>

          {/* Article Image */}
          {getImageSrc(article.image) ? (
            <div className="aspect-video relative rounded-3xl overflow-hidden">
              <OptimizedImage
                src={getImageSrc(article.image)!}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
              <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                <div className="bg-white/90 backdrop-blur-sm text-[#6812F7] px-6 py-3 rounded-full text-lg font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>
                  {article.category.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-3xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{article.image || '📝'}</div>
                <div className="text-2xl font-semibold">{article.category.name}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`prose prose-lg max-w-none ${isRTL ? 'prose-rtl' : ''}`}>
            {article.content && article.content.includes('<') ? (
              // If content contains HTML tags, render as HTML (for backward compatibility)
              <div
                className={isRTL ? 'text-right' : ''}
                dir={isRTL ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              // Otherwise, render as markdown
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children }) => <p className={`mb-4 ${isRTL ? 'text-right' : ''}`}>{children}</p>,
                  h1: ({ children }) => <h1 className={`text-3xl font-bold mb-6 mt-8 ${isRTL ? 'text-right' : ''}`}>{children}</h1>,
                  h2: ({ children }) => <h2 className={`text-2xl font-bold mb-4 mt-6 ${isRTL ? 'text-right' : ''}`}>{children}</h2>,
                  h3: ({ children }) => <h3 className={`text-xl font-bold mb-3 mt-5 ${isRTL ? 'text-right' : ''}`}>{children}</h3>,
                  ul: ({ children }) => <ul className={`mb-4 ${isRTL ? 'pr-6 list-disc text-right' : 'pl-6 list-disc'}`}>{children}</ul>,
                  ol: ({ children }) => <ol className={`mb-4 ${isRTL ? 'pr-6 list-decimal text-right' : 'pl-6 list-decimal'}`}>{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => <blockquote className={`${isRTL ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4'} border-gray-300 italic mb-4`}>{children}</blockquote>,
                  code: ({ children, className }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code className={className}>{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
                    );
                  },
                  pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
                }}
              >
                {article.content || 'No content available'}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#6812F7] hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('relatedArticles')}</h2>
              <p className="text-lg text-gray-600">{t('relatedArticlesDescription')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {article.relatedArticles.map((relatedArticle: any, index: number) => (
                <article key={index} className="">
                  {/* Image Section */}
                  <Link href={`/article/${relatedArticle.slug}`} className="relative group block">
                    {getImageSrc(relatedArticle.image) ? (
                      <div className="aspect-video relative rounded-2xl overflow-hidden">
                        <OptimizedImage
                          src={getImageSrc(relatedArticle.image)!}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md"
                            style={{ color: relatedArticle.category?.color || '#6812F7' }}
                          >
                            {relatedArticle.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center rounded-2xl">
                        <div className="text-6xl text-white">{relatedArticle.image || '📝'}</div>
                        {/* Category Badge for emoji images */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md"
                            style={{ color: relatedArticle.category?.color || '#6812F7' }}
                          >
                            {relatedArticle.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Title Section - No Background */}
                  <div className="px-2 py-4 bg-transparent">
                    <Link href={`/article/${relatedArticle.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-[#6812F7] transition-colors">
                        {relatedArticle.title}
                      </h3>
                    </Link>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        {relatedArticle.author ? (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-r from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {relatedArticle.author.avatar}
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold text-gray-900 text-sm">{relatedArticle.author.name}</p>
                              <p className="text-xs text-gray-500" suppressHydrationWarning>
                                {isMounted
                                  ? new Date(relatedArticle.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
                                  : ''
                                }
                              </p>
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500" suppressHydrationWarning>
                            {isMounted
                              ? new Date(relatedArticle.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
                              : ''
                            }
                          </p>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">{formatReadTime(relatedArticle.readTime)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      {/* Commented out - hidden for now */}
      {/* <section className="py-20 gradient-primary">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${locale === 'ar' ? 'text-right' : 'text-center'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('enjoyedArticle')}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t('newsletterSubscribeDescription')}
          </p>
          <div className={`max-w-md ${locale === 'ar' ? 'ml-auto mr-0' : 'mx-auto'}`}>
            <div className={`flex ${locale === 'ar' ? 'justify-end' : ''}`}>
              {locale === 'ar' ? (
                <>
                  <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    {t('subscribe')}
                  </button>
                  <input
                    type="email"
                    placeholder={t('enterYourEmail')}
                    className="flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium"
                    dir="rtl"
                  />
                </>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder={t('enterYourEmail')}
                    className="flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium"
                  />
                  <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    {t('subscribe')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
})
