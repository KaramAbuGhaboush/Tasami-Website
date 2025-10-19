import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface Article {
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
  content: string;
}

// Sample article data - fallback if backend fails
const fallbackArticles = {
  'the-future-of-ai-in-business': {
    title: "The Future of AI in Business: Trends to Watch in 2024",
    excerpt: "Explore the latest AI trends that are reshaping how businesses operate, from automation to predictive analytics.",
    author: {
      name: "Sarah Johnson",
      role: "AI Research Lead",
      avatar: "👩‍💼",
      bio: "Sarah is a leading AI researcher with over 10 years of experience in machine learning and business automation."
    },
    date: "March 15, 2024",
    category: "AI & Technology",
    readTime: "5 min read",
    image: "🤖",
    featured: true,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Artificial Intelligence is no longer a futuristic concept—it's the driving force behind today's most successful businesses. As we navigate through 2024, we're witnessing unprecedented growth in AI adoption across industries, from healthcare to finance, manufacturing to retail.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Current State of AI in Business</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Today's businesses are leveraging AI in ways that were unimaginable just a few years ago. From predictive analytics that forecast market trends to intelligent automation that streamlines operations, AI is becoming the backbone of modern business strategy.
      </p>

      <div class="bg-gradient-to-r from-[#6812F7] to-[#9253F0] p-8 rounded-2xl my-8">
        <h3 class="text-2xl font-bold text-white mb-4">Key Insight</h3>
        <p class="text-white/90 text-lg leading-relaxed">
          Companies that have integrated AI into their core operations report a 25% increase in productivity and a 30% reduction in operational costs within the first year of implementation.
        </p>
      </div>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Emerging AI Trends for 2024</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">1. Generative AI Integration</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        The rise of generative AI tools like ChatGPT and DALL-E has opened new possibilities for content creation, customer service, and product development. Businesses are now using these tools to generate marketing materials, create personalized customer experiences, and even develop new products.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">2. AI-Powered Automation</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Automation is reaching new heights with AI at its core. From intelligent document processing to automated customer support, businesses are finding innovative ways to reduce manual work while improving accuracy and speed.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">3. Predictive Analytics Revolution</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Advanced predictive models are helping businesses anticipate market changes, customer behavior, and operational needs. This foresight enables proactive decision-making and strategic planning.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Implementation Strategies</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Successfully implementing AI in your business requires a strategic approach. Here are the key steps to consider:
      </p>

      <ul class="list-disc list-inside space-y-4 mb-8">
        <li class="text-lg text-gray-600">
          <strong class="text-gray-900">Start Small:</strong> Begin with pilot projects that address specific pain points in your organization.
        </li>
        <li class="text-lg text-gray-600">
          <strong class="text-gray-900">Invest in Training:</strong> Ensure your team has the necessary skills to work with AI tools effectively.
        </li>
        <li class="text-lg text-gray-600">
          <strong class="text-gray-900">Focus on Data Quality:</strong> AI systems are only as good as the data they're trained on.
        </li>
        <li class="text-lg text-gray-600">
          <strong class="text-gray-900">Measure and Iterate:</strong> Continuously monitor AI performance and make adjustments as needed.
        </li>
      </ul>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Road Ahead</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        As we look toward the future, AI will continue to evolve and become even more integrated into our daily business operations. The companies that embrace this change and invest in AI capabilities today will be the ones that thrive in tomorrow's competitive landscape.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        The future of AI in business is not just about technology—it's about creating more efficient, intelligent, and human-centered organizations that can adapt and grow in an ever-changing world.
      </p>
    `,
    tags: ["AI", "Business", "Technology", "Automation", "Future Trends"],
    relatedArticles: [
      {
        title: "How Automation is Transforming Small Businesses",
        slug: "how-automation-is-transforming-small-businesses",
        category: "Automation",
        readTime: "4 min read"
      },
      {
        title: "Building Scalable AI Systems: Best Practices",
        slug: "building-scalable-ai-systems-best-practices",
        category: "AI & Technology",
        readTime: "8 min read"
      }
    ]
  },
  'how-automation-is-transforming-small-businesses': {
    title: "How Automation is Transforming Small Businesses",
    excerpt: "Discover how small businesses can leverage automation to compete with larger enterprises and scale efficiently.",
    author: {
      name: "Michael Chen",
      role: "Automation Specialist",
      avatar: "👨‍💻",
      bio: "Michael specializes in helping small businesses implement automation solutions that drive growth and efficiency."
    },
    date: "March 12, 2024",
    category: "Automation",
    readTime: "4 min read",
    image: "⚙️",
    featured: false,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Small businesses are discovering that automation isn't just for large corporations anymore. With the right tools and strategies, even the smallest companies can leverage automation to compete with industry giants and scale their operations efficiently.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Automation Advantage for Small Businesses</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Automation levels the playing field, allowing small businesses to operate with the efficiency of much larger organizations. By automating repetitive tasks, small businesses can focus on what they do best: serving their customers and growing their business.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Key Areas for Automation</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Customer Service</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Automated chatbots and email responses can handle common customer inquiries 24/7, ensuring your customers always receive prompt assistance.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Marketing</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Email marketing automation, social media scheduling, and lead nurturing campaigns can run in the background while you focus on other aspects of your business.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Operations</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        From inventory management to invoice generation, automation can streamline your day-to-day operations and reduce the risk of human error.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Getting Started with Automation</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        The key to successful automation is starting small and gradually expanding. Identify the most time-consuming tasks in your business and look for automation solutions that can address them.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        Remember, automation is a tool to enhance your business, not replace the human touch that makes your business unique. The goal is to free up your time so you can focus on what matters most: growing your business and serving your customers.
      </p>
    `,
    tags: ["Automation", "Small Business", "Efficiency", "Growth"],
    relatedArticles: [
      {
        title: "The Future of AI in Business: Trends to Watch in 2024",
        slug: "the-future-of-ai-in-business",
        category: "AI & Technology",
        readTime: "5 min read"
      },
      {
        title: "Marketing Automation: Strategies for 2024",
        slug: "marketing-automation-strategies-2024",
        category: "Marketing",
        readTime: "7 min read"
      }
    ]
  },
  'ux-ui-design-principles-for-modern-web-applications': {
    title: "UX/UI Design Principles for Modern Web Applications",
    excerpt: "Learn the essential design principles that create engaging and user-friendly web experiences.",
    author: {
      name: "Emily Rodriguez",
      role: "UX/UI Designer",
      avatar: "👩‍🎨",
      bio: "Emily is a senior UX/UI designer with expertise in creating intuitive and beautiful digital experiences."
    },
    date: "March 10, 2024",
    category: "Design",
    readTime: "6 min read",
    image: "🎨",
    featured: false,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        In today's digital landscape, creating exceptional user experiences is more important than ever. With users having countless options at their fingertips, the design of your web application can make or break its success.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Foundation of Great Design</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Great UX/UI design starts with understanding your users and their needs. Every design decision should be made with the user's goals and pain points in mind.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Key Design Principles</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">1. User-Centered Design</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Always design with your users in mind. Conduct user research, create personas, and test your designs with real users to ensure they meet actual needs.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">2. Consistency</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Maintain visual and functional consistency throughout your application. This includes colors, typography, spacing, and interaction patterns.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">3. Accessibility</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Design for all users, including those with disabilities. Ensure proper contrast ratios, keyboard navigation, and screen reader compatibility.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Modern Design Trends</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Stay current with design trends while maintaining timeless principles. Focus on clean layouts, meaningful micro-interactions, and responsive design that works across all devices.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        Remember, great design is not just about aesthetics—it's about creating experiences that users love and that drive business results.
      </p>
    `,
    tags: ["Design", "UX", "UI", "User Experience", "Web Design"],
    relatedArticles: [
      {
        title: "The Role of Design Thinking in Tech Development",
        slug: "the-role-of-design-thinking-in-tech-development",
        category: "Design",
        readTime: "5 min read"
      },
      {
        title: "Building Scalable AI Systems: Best Practices",
        slug: "building-scalable-ai-systems-best-practices",
        category: "AI & Technology",
        readTime: "8 min read"
      }
    ]
  },
  'marketing-automation-strategies-for-2024': {
    title: "Marketing Automation: Strategies for 2024",
    excerpt: "Effective marketing automation strategies that can help businesses reach their target audience more efficiently.",
    author: {
      name: "Lisa Thompson",
      role: "Marketing Strategist",
      avatar: "👩‍💼",
      bio: "Lisa is a marketing automation expert with over 8 years of experience in digital marketing and lead generation."
    },
    date: "March 8, 2024",
    category: "Marketing",
    readTime: "7 min read",
    image: "📈",
    featured: false,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Marketing automation has evolved from a nice-to-have tool to an essential component of modern marketing strategies. In 2024, businesses that master automation will have a significant competitive advantage.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Power of Marketing Automation</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Marketing automation allows businesses to nurture leads, engage customers, and drive conversions at scale. By automating repetitive tasks, marketers can focus on strategy and creative work.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Key Automation Strategies</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Email Marketing Automation</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Create personalized email sequences that nurture leads through the sales funnel. Use behavioral triggers to send relevant content at the right time.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Social Media Automation</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Schedule posts, respond to comments, and engage with your audience across multiple platforms without constant manual intervention.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Lead Scoring and Nurturing</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Automatically score leads based on their behavior and engagement, then route them to the appropriate sales team member or nurture sequence.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Best Practices for 2024</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Focus on personalization, use AI-powered insights, and always prioritize the customer experience. The most successful automation strategies put the customer at the center of every interaction.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        Start with simple automations and gradually build complexity as you learn what works best for your audience and business goals.
      </p>
    `,
    tags: ["Marketing", "Automation", "Email Marketing", "Lead Generation", "Digital Marketing"],
    relatedArticles: [
      {
        title: "How Automation is Transforming Small Businesses",
        slug: "how-automation-is-transforming-small-businesses",
        category: "Automation",
        readTime: "4 min read"
      },
      {
        title: "The Future of AI in Business: Trends to Watch in 2024",
        slug: "the-future-of-ai-in-business",
        category: "AI & Technology",
        readTime: "5 min read"
      }
    ]
  },
  'building-scalable-ai-systems-best-practices': {
    title: "Building Scalable AI Systems: Best Practices",
    excerpt: "Technical insights on architecting AI systems that can handle growing data and user demands.",
    author: {
      name: "Alex Martinez",
      role: "AI Systems Architect",
      avatar: "👨‍🔬",
      bio: "Alex is a senior AI engineer specializing in building scalable machine learning systems for enterprise applications."
    },
    date: "March 5, 2024",
    category: "AI & Technology",
    readTime: "8 min read",
    image: "🔬",
    featured: false,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Building AI systems that can scale with your business is one of the biggest challenges in modern software development. As your user base grows and data volumes increase, your AI infrastructure must be able to handle the load.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Architecture Challenge</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Scalable AI systems require careful planning from the ground up. You need to consider data pipelines, model serving, monitoring, and the ability to handle traffic spikes.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Key Components of Scalable AI</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Data Infrastructure</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Build robust data pipelines that can handle large volumes of data efficiently. Use streaming technologies and implement proper data validation and monitoring.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Model Serving</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Implement model serving infrastructure that can handle high throughput and low latency. Consider using containerization and auto-scaling.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">Monitoring and Observability</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Implement comprehensive monitoring to track model performance, system health, and business metrics. This is crucial for maintaining system reliability.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Best Practices</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Start with a solid foundation, plan for growth from day one, and always have a backup plan. The most successful AI systems are those that can adapt and evolve with changing requirements.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        Remember, scalability is not just about handling more data—it's about building systems that can grow with your business and adapt to new challenges.
      </p>
    `,
    tags: ["AI", "Scalability", "Architecture", "Machine Learning", "Systems Design"],
    relatedArticles: [
      {
        title: "The Future of AI in Business: Trends to Watch in 2024",
        slug: "the-future-of-ai-in-business",
        category: "AI & Technology",
        readTime: "5 min read"
      },
      {
        title: "UX/UI Design Principles for Modern Web Applications",
        slug: "ux-ui-design-principles-for-modern-web-applications",
        category: "Design",
        readTime: "6 min read"
      }
    ]
  },
  'the-role-of-design-thinking-in-tech-development': {
    title: "The Role of Design Thinking in Tech Development",
    excerpt: "How design thinking principles can improve the development process and create better user experiences.",
    author: {
      name: "David Kim",
      role: "Design Thinking Consultant",
      avatar: "👨‍💡",
      bio: "David helps tech teams implement design thinking methodologies to create more user-centered products and services."
    },
    date: "March 3, 2024",
    category: "Design",
    readTime: "5 min read",
    image: "💡",
    featured: false,
    content: `
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Design thinking is not just for designers—it's a powerful methodology that can transform how tech teams approach problem-solving and product development.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">What is Design Thinking?</h2>
      
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Design thinking is a human-centered approach to innovation that draws from the designer's toolkit to integrate the needs of people, the possibilities of technology, and the requirements for business success.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Five Stages of Design Thinking</h2>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">1. Empathize</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Understand your users' needs, experiences, and motivations. Conduct user research and interviews to gain deep insights.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">2. Define</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Clearly articulate the problem you're trying to solve based on your user research findings.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">3. Ideate</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Generate a wide range of creative solutions to your defined problem. Don't limit yourself—think outside the box.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">4. Prototype</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Create simple, low-cost prototypes of your best ideas to test and refine your solutions.
      </p>

      <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">5. Test</h3>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Test your prototypes with real users and gather feedback to iterate and improve your solutions.
      </p>

      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Benefits for Tech Teams</h2>

      <p class="text-lg text-gray-600 leading-relaxed mb-6">
        Design thinking helps tech teams create products that users actually want and need. It reduces the risk of building the wrong thing and increases the chances of success.
      </p>

      <p class="text-lg text-gray-600 leading-relaxed mb-8">
        By incorporating design thinking into your development process, you can create more innovative, user-centered solutions that drive business results.
      </p>
    `,
    tags: ["Design Thinking", "User Experience", "Innovation", "Product Development", "User Research"],
    relatedArticles: [
      {
        title: "UX/UI Design Principles for Modern Web Applications",
        slug: "ux-ui-design-principles-for-modern-web-applications",
        category: "Design",
        readTime: "6 min read"
      },
      {
        title: "Building Scalable AI Systems: Best Practices",
        slug: "building-scalable-ai-systems-best-practices",
        category: "AI & Technology",
        readTime: "8 min read"
      }
    ]
  }
}

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

// Helper function to normalize article data
function normalizeArticle(article: any): Article {
  return {
    ...article,
    category: typeof article.category === 'string' 
      ? { id: '', name: article.category, slug: '', color: '#6812F7' }
      : article.category,
    createdAt: article.createdAt || article.date || new Date().toISOString(),
    date: article.date || new Date(article.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  let article: Article | null = null
  
  try {
    // Try to fetch from backend API first
    const response = await apiClient.getBlogArticle(slug)
    if (response.success) {
      article = normalizeArticle(response.data.article)
    }
  } catch (error) {
    console.error('Error fetching article from backend:', error)
  }
  
  // Fallback to static data if backend fails
  if (!article) {
    const fallbackArticle = fallbackArticles[slug as keyof typeof fallbackArticles] as any
    if (fallbackArticle) {
      article = normalizeArticle(fallbackArticle)
    }
  }

  if (!article) {
    notFound()
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
            <span>{article.date}</span>
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
              <p className="text-sm text-gray-500 mt-1">{article.author.bio}</p>
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {article.relatedArticles.map((relatedArticle, index) => (
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

export async function generateStaticParams() {
  try {
    // Try to get articles from backend
    const response = await apiClient.getBlogArticles()
    if (response.success) {
      return response.data.articles.map((article: Article) => ({
        slug: article.slug,
      }))
    }
  } catch (error) {
    console.error('Error fetching articles for static params:', error)
  }
  
  // Fallback to static data
  return Object.keys(fallbackArticles).map((slug) => ({
    slug,
  }))
}
