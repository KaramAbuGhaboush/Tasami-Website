'use client'

import Link from 'next/link'
import { useLanguage } from '../../context/LanguageContext'

export default function Blog() {
  const { t, language, isInitialized } = useLanguage();
  const blogPostsData = t('blog.posts');
  const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : [];
  const categoriesData = t('blog.categories');
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Show loading state if translations are not ready
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
                {t('blog.hero.title')}
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
                  placeholder={t('blog.search.placeholder')}
                  className="w-full lg:w-96 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6812F7] focus:border-[#6812F7] transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Featured Post */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Featured Post Visual - Clickable */}
            <Link href="#" className="relative group cursor-pointer">
              <div className="luxury-card rounded-3xl overflow-hidden group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🤖</div>
                    <div className="text-lg font-semibold">{t('blog.featured.category')}</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Featured Post Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{t('blog.featured.readTime')}</span>
                <span>•</span>
                <span>{t('blog.featured.category')}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t('blog.featured.title')}
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                {t('blog.featured.excerpt')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {Array.isArray(categories) && categories.map((category: string, index: number) => (
              <button
                key={index}
                className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 hover:border-[#6812F7] hover:text-[#6812F7] transition-all duration-300"
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
            {Array.isArray(blogPosts) && blogPosts.filter((post: any) => !post.featured).map((post: any, index: number) => (
              <article key={index} className="">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden group">
                  <div className="w-full h-full bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center rounded-2xl">
                    <div className="text-6xl text-white">{post.image}</div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-[#6812F7] px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Title Section - No Background */}
                <div className="px-2 py-4 bg-transparent">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {post.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('blog.newsletter.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('blog.newsletter.description')}
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              {language === "ar" ? <>
                <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                  {t('blog.newsletter.subscribe')}
                </button>
                <input
                  type="email"
                  placeholder={t('blog.newsletter.placeholder')}
                  className={`flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium ${language === 'ar' ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  style={language === 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                />
              </> : <>

                <input
                  type="email"
                  placeholder={t('blog.newsletter.placeholder')}
                  className={`flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium ${language === 'ar' ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  style={language === 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                />
                <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                  {t('blog.newsletter.subscribe')}
                </button>
              </>}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('blog.topics.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('blog.topics.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(() => {
              const topics = t('blog.topics.items');
              if (Array.isArray(topics)) {
                return topics.map((topic: any, index: number) => (
                  <div key={index} className="luxury-card p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-4">{topic.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="text-2xl font-bold gradient-text">{topic.articles}</div>
                  </div>
                ));
              }
              return null;
            })()}
          </div>
        </div>
      </section>
    </div>
  )
}