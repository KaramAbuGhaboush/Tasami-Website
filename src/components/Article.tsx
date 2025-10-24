import Link from 'next/link'
import { Article } from '@/hooks/useArticle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

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
      return `http://localhost:3002/uploads/images/${image}`;
    }

    // For anything else (like emojis), return null to show as emoji
    return null;
  };

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
          {getImageSrc(article.image) ? (
            <div className="aspect-video relative rounded-3xl overflow-hidden">
              <img 
                src={getImageSrc(article.image)!} 
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
          <div className="prose prose-lg max-w-none">
            {article.content && article.content.includes('<') ? (
              // If content contains HTML tags, render as HTML (for backward compatibility)
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              // Otherwise, render as markdown
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children }) => <p className="mb-4">{children}</p>,
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>,
                  ul: ({ children }) => <ul className="mb-4 pl-6 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 pl-6 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">{children}</blockquote>,
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-lg text-gray-600">Continue exploring similar content</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {article.relatedArticles.map((relatedArticle: any, index: number) => (
                <Link
                  key={index}
                  href={`/article/${relatedArticle.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Article Image */}
                  <div className="aspect-video relative overflow-hidden">
                    {getImageSrc(relatedArticle.image) ? (
                      <img 
                        src={getImageSrc(relatedArticle.image)!} 
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">{relatedArticle.image || '📝'}</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#6812F7] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm text-gray-500">{relatedArticle.readTime}</span>
                      <span>•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(relatedArticle.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#6812F7] transition-colors mb-3 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                  </div>
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
