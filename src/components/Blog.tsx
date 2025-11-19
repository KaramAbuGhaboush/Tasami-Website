'use client'

import { useState, useMemo, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { BlogPost, BlogCategory } from '@/hooks/useBlog'

interface BlogProps {
  blogPosts: BlogPost[];
  categories: string[];
  categoryObjects: BlogCategory[];
  loading: boolean;
  error: string | null;
  featuredPost: BlogPost | undefined;
  regularPosts: BlogPost[];
  handleRetry: () => void;
}

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

export function Blog({
  blogPosts,
  categories,
  categoryObjects,
  loading,
  error,
  featuredPost,
  regularPosts,
  handleRetry
}: BlogProps) {
  const t = useTranslations('blog')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  // Memoize article count calculation for performance
  const articleCountsByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    blogPosts.forEach(post => {
      const categoryId = post.category.id;
      counts.set(categoryId, (counts.get(categoryId) || 0) + 1);
    });
    return counts;
  }, [blogPosts]);

  // Memoize article count function
  const getArticleCount = useCallback((categoryId: string) => {
    return articleCountsByCategory.get(categoryId) || 0;
  }, [articleCountsByCategory]);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return regularPosts;
    }
    return regularPosts.filter(post => post.category.name === selectedCategory);
  }, [regularPosts, selectedCategory]);

  // Handle category selection
  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Memoize featured categories selection for performance - ensure we show exactly 4 cards
  const displayCategories = useMemo(() => {
    // First, get all featured categories
    const featuredCategories = categoryObjects.filter(cat => cat.featured);

    // If we have 4 or more featured categories, return first 4
    if (featuredCategories.length >= 4) {
      return featuredCategories.slice(0, 4);
    }

    // If we have some featured categories but less than 4, fill with regular categories
    if (featuredCategories.length > 0) {
      const remaining = 4 - featuredCategories.length;
      const regularCategories = categoryObjects
        .filter(cat => !cat.featured)
        .slice(0, remaining);
      return [...featuredCategories, ...regularCategories].slice(0, 4);
    }

    // If no featured categories, just take first 4 from all categories
    return categoryObjects.slice(0, 4);
  }, [categoryObjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingPosts')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('errorLoading')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#9253F0] transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Blog Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            {/* Blog Title */}
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t('tasamiBlog')}
              </h1>
            </div>

            {/* Enhanced Search Bar */}
            <div className="lg:ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 014 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full lg:w-96 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6812F7] focus:border-[#6812F7] transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Featured Post */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Featured Post Visual - Clickable */}
            {featuredPost && (
              <Link href={`/article/${featuredPost.slug}`} className="relative group cursor-pointer">
                <div className="luxury-card rounded-3xl overflow-hidden group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  {getImageSrc(featuredPost.image) ? (
                    <div className="aspect-video relative">
                      <img
                        src={getImageSrc(featuredPost.image)!}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm text-[#6812F7] px-4 py-2 rounded-full text-sm font-semibold">
                          {featuredPost.category.name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">{featuredPost.image || '📝'}</div>
                        <div className="text-lg font-semibold">{featuredPost.category.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Featured Post Content */}
            {featuredPost && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{formatReadTime(featuredPost.readTime)}</span>
                  <span>•</span>
                  <span>{featuredPost.category.name}</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              key="all"
              onClick={() => handleCategoryClick('all')}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${
                selectedCategory === 'all'
                  ? 'border-[#6812F7] text-[#6812F7] bg-[#6812F7]/5'
                  : 'border-gray-300 text-gray-700 hover:border-[#6812F7] hover:text-[#6812F7]'
              }`}
            >
              {t('allCategories')}
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${
                  selectedCategory === category
                    ? 'border-[#6812F7] text-[#6812F7] bg-[#6812F7]/5'
                    : 'border-gray-300 text-gray-700 hover:border-[#6812F7] hover:text-[#6812F7]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">{t('noPostsFound') || 'No posts found in this category.'}</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
              <article key={post.id} className="">
                {/* Image Section */}
                <Link href={`/article/${post.slug}`} className="relative group block">
                  {getImageSrc(post.image) ? (
                    <div className="aspect-video relative rounded-2xl overflow-hidden">
                      <img
                        src={getImageSrc(post.image)!}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md"
                          style={{ color: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center rounded-2xl">
                      <div className="text-6xl text-white">{post.image || '📝'}</div>
                      {/* Category Badge for emoji images */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md"
                          style={{ color: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Title Section - No Background */}
                <div className="px-2 py-4 bg-transparent">
                  <Link href={`/article/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-[#6812F7] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {post.author.avatar}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{formatReadTime(post.readTime)}</span>
                  </div>
                </div>
              </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      {/* Commented out - hidden for now */}
      {/* <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('stayUpdated')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('newsletterDescription')}
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              {isRTL ? (
                <>
                  <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    {t('subscribe')}
                  </button>
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium"
                  />
                </>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
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

      {/* Popular Topics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('popularTopics')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('popularTopicsDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCategories.length > 0 ? (
              displayCategories.map((category) => {
                const articleCount = getArticleCount(category.id);
                return (
                  <div key={category.id} className="luxury-card p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-4">{category.icon || '📝'}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {category.description || t('popularTopicsDescription')}
                    </p>
                    <div className="text-2xl font-bold gradient-text">
                      {articleCount}+ {t('popularTopicsArticles') || 'Articles'}
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback if no categories available
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">{t('noCategories') || 'No categories available.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
