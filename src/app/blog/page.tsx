'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface BlogPost {
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
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, categoriesResponse] = await Promise.all([
          apiClient.getBlogArticles(),
          apiClient.getBlogCategories()
        ]);

        if (articlesResponse.success) {
          setBlogPosts(articlesResponse.data.articles);
        }

        if (categoriesResponse.success) {
          const categoryNames = ["All", ...categoriesResponse.data.categories.map((cat: any) => cat.name)];
          setCategories(categoryNames);
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blog</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#9253F0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen">
      {/* Blog Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            {/* Blog Title */}
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Tasami Blog
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
                  placeholder="Search articles..."
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
                  <div className="aspect-video bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">{featuredPost.image}</div>
                      <div className="text-lg font-semibold">{featuredPost.category.name}</div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Featured Post Content */}
            {featuredPost && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{featuredPost.readTime}</span>
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
            {categories.map((category, index) => (
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
            {regularPosts.map((post, index) => (
              <article key={post.id} className="">
                {/* Image Section */}
                <Link href={`/article/${post.slug}`} className="relative h-48 overflow-hidden group block">
                  <div className="w-full h-full bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center rounded-2xl">
                    <div className="text-6xl text-white">{post.image}</div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md"
                      style={{ color: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  </div>
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
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
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
            Stay Updated
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest insights on AI, automation, design, and marketing delivered to your inbox.
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

      {/* Popular Topics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our most popular content categories and trending topics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="luxury-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI & Machine Learning</h3>
              <p className="text-gray-600 mb-4">Latest trends and insights in artificial intelligence</p>
              <div className="text-2xl font-bold gradient-text">25+ Articles</div>
            </div>

            <div className="luxury-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Automation</h3>
              <p className="text-gray-600 mb-4">Workflow automation and process optimization</p>
              <div className="text-2xl font-bold gradient-text">18+ Articles</div>
            </div>

            <div className="luxury-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Design & UX</h3>
              <p className="text-gray-600 mb-4">User experience and interface design best practices</p>
              <div className="text-2xl font-bold gradient-text">22+ Articles</div>
            </div>

            <div className="luxury-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing</h3>
              <p className="text-gray-600 mb-4">Digital marketing strategies and growth tactics</p>
              <div className="text-2xl font-bold gradient-text">20+ Articles</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}