import Link from 'next/link'

export default function Blog() {
  const blogPosts = [
    {
      title: "The Future of AI in Business: Trends to Watch in 2024",
      excerpt: "Explore the latest AI trends that are reshaping how businesses operate, from automation to predictive analytics.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "AI & Technology",
      readTime: "5 min read",
      image: "🤖",
      featured: true
    },
    {
      title: "How Automation is Transforming Small Businesses",
      excerpt: "Discover how small businesses can leverage automation to compete with larger enterprises and scale efficiently.",
      author: "Michael Chen",
      date: "March 12, 2024",
      category: "Automation",
      readTime: "4 min read",
      image: "⚙️",
      featured: false
    },
    {
      title: "UX/UI Design Principles for Modern Web Applications",
      excerpt: "Learn the essential design principles that create engaging and user-friendly web experiences.",
      author: "Emily Rodriguez",
      date: "March 10, 2024",
      category: "Design",
      readTime: "6 min read",
      image: "🎨",
      featured: false
    },
    {
      title: "Marketing Automation: Strategies for 2024",
      excerpt: "Effective marketing automation strategies that can help businesses reach their target audience more efficiently.",
      author: "Lisa Thompson",
      date: "March 8, 2024",
      category: "Marketing",
      readTime: "7 min read",
      image: "📈",
      featured: false
    },
    {
      title: "Building Scalable AI Systems: Best Practices",
      excerpt: "Technical insights on architecting AI systems that can handle growing data and user demands.",
      author: "Alex Martinez",
      date: "March 5, 2024",
      category: "AI & Technology",
      readTime: "8 min read",
      image: "🔬",
      featured: false
    },
    {
      title: "The Role of Design Thinking in Tech Development",
      excerpt: "How design thinking principles can improve the development process and create better user experiences.",
      author: "David Kim",
      date: "March 3, 2024",
      category: "Design",
      readTime: "5 min read",
      image: "💡",
      featured: false
    }
  ]

  const categories = ["All", "AI & Technology", "Automation", "Design", "Marketing", "Industry Insights"]

  return (
    <div className="min-h-screen">
      {/* Blog Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            {/* Blog Title */}
            <div className="mb-8 lg:mb-0">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
                Tasami Blog
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="lg:ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 014 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full lg:w-80 pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6812F7] focus:border-transparent"
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
                    <div className="text-lg font-semibold">AI Technology</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Featured Post Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>6 min</span>
                <span>•</span>
                <span>AI & Technology</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                The Future of AI in Business: Trends to Watch in 2024
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Explore the latest AI trends that are reshaping how businesses operate, from automation to predictive analytics and machine learning applications.
              </p>
            </div>
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
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <article key={index} className="rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden group">
                  <div className="w-full h-full bg-gradient-to-br from-[#6812F7] to-[#9253F0] flex items-center justify-center">
                    <div className="text-6xl text-white">{post.image}</div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-[#6812F7] px-3 py-1 rounded-lg text-sm font-bold shadow-md">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                {/* Title Section - No Background */}
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
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
                className="flex-1 px-4 py-3 rounded-l-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#6812F7] px-6 py-3 rounded-r-full font-semibold hover:bg-gray-100 transition-colors">
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