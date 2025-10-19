import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBlogArticles() {
  console.log('🌱 Seeding blog articles...');

  try {
    // Create blog categories first
    const categories = await Promise.all([
      prisma.blogCategory.upsert({
        where: { slug: 'ai-technology' },
        update: {},
        create: {
          name: 'AI & Technology',
          slug: 'ai-technology',
          description: 'Latest trends and insights in artificial intelligence',
          color: '#6812F7',
          icon: '🤖',
          featured: true
        }
      }),
      prisma.blogCategory.upsert({
        where: { slug: 'automation' },
        update: {},
        create: {
          name: 'Automation',
          slug: 'automation',
          description: 'Workflow automation and process optimization',
          color: '#9253F0',
          icon: '⚙️',
          featured: true
        }
      }),
      prisma.blogCategory.upsert({
        where: { slug: 'design' },
        update: {},
        create: {
          name: 'Design',
          slug: 'design',
          description: 'User experience and interface design best practices',
          color: '#F59E0B',
          icon: '🎨',
          featured: true
        }
      }),
      prisma.blogCategory.upsert({
        where: { slug: 'marketing' },
        update: {},
        create: {
          name: 'Marketing',
          slug: 'marketing',
          description: 'Digital marketing strategies and growth tactics',
          color: '#10B981',
          icon: '📈',
          featured: true
        }
      })
    ]);

    // Create blog authors
    const authors = await Promise.all([
      prisma.blogAuthor.upsert({
        where: { email: 'sarah.johnson@tasami.com' },
        update: {},
        create: {
          name: 'Sarah Johnson',
          role: 'AI Research Lead',
          email: 'sarah.johnson@tasami.com',
          avatar: '👩‍💼',
          bio: 'Sarah is a leading AI researcher with over 10 years of experience in machine learning and business automation.',
          socialLinks: {
            twitter: '@sarahjohnson',
            linkedin: 'sarah-johnson-ai'
          },
          expertise: ['Machine Learning', 'AI Research', 'Business Automation']
        }
      }),
      prisma.blogAuthor.upsert({
        where: { email: 'michael.chen@tasami.com' },
        update: {},
        create: {
          name: 'Michael Chen',
          role: 'Automation Specialist',
          email: 'michael.chen@tasami.com',
          avatar: '👨‍💻',
          bio: 'Michael specializes in helping small businesses implement automation solutions that drive growth and efficiency.',
          socialLinks: {
            twitter: '@michaelchen',
            linkedin: 'michael-chen-automation'
          },
          expertise: ['Process Automation', 'Small Business', 'Workflow Optimization']
        }
      }),
      prisma.blogAuthor.upsert({
        where: { email: 'emily.rodriguez@tasami.com' },
        update: {},
        create: {
          name: 'Emily Rodriguez',
          role: 'UX/UI Designer',
          email: 'emily.rodriguez@tasami.com',
          avatar: '👩‍🎨',
          bio: 'Emily is a senior UX/UI designer with expertise in creating intuitive and beautiful digital experiences.',
          socialLinks: {
            twitter: '@emilyrodriguez',
            linkedin: 'emily-rodriguez-design'
          },
          expertise: ['UX Design', 'UI Design', 'User Research']
        }
      }),
      prisma.blogAuthor.upsert({
        where: { email: 'lisa.thompson@tasami.com' },
        update: {},
        create: {
          name: 'Lisa Thompson',
          role: 'Marketing Strategist',
          email: 'lisa.thompson@tasami.com',
          avatar: '👩‍💼',
          bio: 'Lisa is a marketing automation expert with over 8 years of experience in digital marketing and lead generation.',
          socialLinks: {
            twitter: '@lisathompson',
            linkedin: 'lisa-thompson-marketing'
          },
          expertise: ['Digital Marketing', 'Marketing Automation', 'Lead Generation']
        }
      })
    ]);

    // Create blog articles
    const articles = await Promise.all([
      prisma.blogArticle.upsert({
        where: { slug: 'the-future-of-ai-in-business' },
        update: {},
        create: {
          title: 'The Future of AI in Business: Trends to Watch in 2024',
          slug: 'the-future-of-ai-in-business',
          excerpt: 'Explore the latest AI trends that are reshaping how businesses operate, from automation to predictive analytics.',
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
          image: '🤖',
          readTime: '5 min read',
          featured: true,
          status: 'published',
          views: 1250,
          tags: ['AI', 'Business', 'Technology', 'Automation', 'Future Trends'],
          relatedArticles: [],
          authorId: authors[0].id,
          categoryId: categories[0].id
        }
      }),
      prisma.blogArticle.upsert({
        where: { slug: 'how-automation-is-transforming-small-businesses' },
        update: {},
        create: {
          title: 'How Automation is Transforming Small Businesses',
          slug: 'how-automation-is-transforming-small-businesses',
          excerpt: 'Discover how small businesses can leverage automation to compete with larger enterprises and scale efficiently.',
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
          image: '⚙️',
          readTime: '4 min read',
          featured: false,
          status: 'published',
          views: 890,
          tags: ['Automation', 'Small Business', 'Efficiency', 'Growth'],
          relatedArticles: [],
          authorId: authors[1].id,
          categoryId: categories[1].id
        }
      }),
      prisma.blogArticle.upsert({
        where: { slug: 'ux-ui-design-principles-for-modern-web-applications' },
        update: {},
        create: {
          title: 'UX/UI Design Principles for Modern Web Applications',
          slug: 'ux-ui-design-principles-for-modern-web-applications',
          excerpt: 'Learn the essential design principles that create engaging and user-friendly web experiences.',
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
          image: '🎨',
          readTime: '6 min read',
          featured: false,
          status: 'published',
          views: 1100,
          tags: ['Design', 'UX', 'UI', 'User Experience', 'Web Design'],
          relatedArticles: [],
          authorId: authors[2].id,
          categoryId: categories[2].id
        }
      }),
      prisma.blogArticle.upsert({
        where: { slug: 'marketing-automation-strategies-for-2024' },
        update: {},
        create: {
          title: 'Marketing Automation: Strategies for 2024',
          slug: 'marketing-automation-strategies-for-2024',
          excerpt: 'Effective marketing automation strategies that can help businesses reach their target audience more efficiently.',
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
          image: '📈',
          readTime: '7 min read',
          featured: false,
          status: 'published',
          views: 950,
          tags: ['Marketing', 'Automation', 'Email Marketing', 'Lead Generation', 'Digital Marketing'],
          relatedArticles: [],
          authorId: authors[3].id,
          categoryId: categories[3].id
        }
      })
    ]);

    console.log('✅ Blog articles seeded successfully!');
    console.log(`📝 Created ${articles.length} articles`);
    console.log(`👥 Created ${authors.length} authors`);
    console.log(`📂 Created ${categories.length} categories`);

  } catch (error) {
    console.error('❌ Error seeding blog articles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedBlogArticles()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
