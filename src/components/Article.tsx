import Link from 'next/link'
import { Article } from '@/hooks/useArticle'

interface ArticleProps {
  article: Article;
  loading: boolean;
  error: string | null;
  handleRetry: () => void;
}

export function ArticleComponent({ article, loading, error, handleRetry }: ArticleProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Article</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link 
            href="/blog" 
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#5a0fd4] transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#6812F7] transition-colors">Home</Link>
              <span>›</span>
              <Link href="/blog" className="hover:text-[#6812F7] transition-colors">Blog</Link>
              <span>›</span>
              <span className="text-gray-900">{article.category.name}</span>
            </div>
          </nav>

          {/* Article Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="bg-[#6812F7] text-white px-3 py-1 rounded-full text-xs font-semibold">
              {article.category.name}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Article Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {article.excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center text-2xl">
              {article.author.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{article.author.name}</h3>
              <p className="text-gray-600">{article.author.role}</p>
              {article.author.bio && (
                <p className="text-sm text-gray-500 mt-1">{article.author.bio}</p>
              )}
            </div>
          </div>

          {/* Article Image */}
          {article.image && (article.image.startsWith('http') || article.image.startsWith('blob:')) ? (
            <div className="aspect-video relative rounded-3xl overflow-hidden mb-12">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm text-[#6812F7] px-6 py-3 rounded-full text-lg font-semibold">
                  {article.category.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-3xl flex items-center justify-center mb-12">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{article.image || '📝'}</div>
                <div className="text-2xl font-semibold">{article.category.name}</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {article.relatedArticles.map((relatedArticle: any, index: number) => (
                <Link
                  key={index}
                  href={`/article/${relatedArticle.slug}`}
                  className="luxury-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-[#6812F7] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {relatedArticle.category}
                    </span>
                    <span className="text-sm text-gray-500">{relatedArticle.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#6812F7] transition-colors">
                    {relatedArticle.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Enjoyed This Article?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Subscribe to our newsletter and get more insights like this delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-l-full text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/40 placeholder-gray-600 font-medium"
              />
              <button className="bg-white text-[#6812F7] px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
