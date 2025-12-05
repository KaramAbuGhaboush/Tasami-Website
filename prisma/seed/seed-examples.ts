import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExamples() {
  console.log('🌱 Seeding example project and blog article...');

  try {
    // Get or create a project category
    let projectCategory = await prisma.projectCategory.findFirst({
      where: { slug: 'ai-solutions' }
    });

    if (!projectCategory) {
      projectCategory = await prisma.projectCategory.create({
        data: {
          name: 'AI Solutions',
          nameAr: 'حلول الذكاء الاصطناعي',
          slug: 'ai-solutions',
          description: 'Artificial Intelligence and Machine Learning solutions',
          descriptionAr: 'حلول الذكاء الاصطناعي وتعلم الآلة',
          color: '#10B981',
          icon: 'brain',
          featured: true,
          sortOrder: 1,
          status: 'active'
        }
      });
      console.log('✅ Created project category: AI Solutions');
    }

    // Create example project
    const exampleProject = await prisma.project.upsert({
      where: { id: 'example-smart-analytics-platform' },
      update: {},
      create: {
        id: 'example-smart-analytics-platform',
        title: 'Smart Analytics Platform',
        titleAr: 'منصة التحليلات الذكية',
        description: 'A comprehensive business intelligence platform that leverages AI and machine learning to provide real-time insights, predictive analytics, and automated reporting for enterprises.',
        descriptionAr: 'منصة ذكاء أعمال شاملة تستفيد من الذكاء الاصطناعي وتعلم الآلة لتوفير رؤى في الوقت الفعلي وتحليلات تنبؤية وتقارير آلية للشركات.',
        headerImage: '/api/placeholder/1200/600',
        challenge: 'The client needed a unified analytics solution that could process millions of data points from multiple sources, provide actionable insights, and reduce manual reporting time by 80%.',
        challengeAr: 'كان العميل بحاجة إلى حل تحليلي موحد يمكنه معالجة ملايين نقاط البيانات من مصادر متعددة وتوفير رؤى قابلة للتنفيذ وتقليل وقت إعداد التقارير اليدوية بنسبة 80%.',
        solution: 'We developed a cloud-native analytics platform with AI-powered data processing, automated report generation, and intuitive dashboards. The system uses machine learning algorithms to identify patterns and predict trends.',
        solutionAr: 'طورنا منصة تحليلات سحابية أصلية مع معالجة بيانات مدعومة بالذكاء الاصطناعي وتوليد تقارير تلقائية ولوحات معلومات بديهية. يستخدم النظام خوارزميات تعلم الآلة لتحديد الأنماط والتنبؤ بالاتجاهات.',
        timeline: '8 months',
        timelineAr: '8 أشهر',
        teamSize: '12 developers',
        teamSizeAr: '12 مطور',
        status: 'active',
        categoryId: projectCategory.id,
        technologies: {
          create: [
            {
              name: 'React & Next.js',
              nameAr: 'رياكت ونكست جي إس',
              description: 'Modern frontend framework with server-side rendering for optimal performance',
              descriptionAr: 'إطار عمل أمامي حديث مع عرض من جانب الخادم للأداء الأمثل'
            },
            {
              name: 'Python & TensorFlow',
              nameAr: 'بايثون وتنسورفلو',
              description: 'Machine learning models for predictive analytics and pattern recognition',
              descriptionAr: 'نماذج تعلم الآلة للتحليلات التنبؤية والتعرف على الأنماط'
            },
            {
              name: 'PostgreSQL & Redis',
              nameAr: 'بوستجري إس كيو إل وريديس',
              description: 'Scalable database architecture with caching for high-performance data retrieval',
              descriptionAr: 'هندسة قاعدة بيانات قابلة للتوسع مع التخزين المؤقت لاسترجاع البيانات عالي الأداء'
            },
            {
              name: 'AWS Cloud Services',
              nameAr: 'خدمات سحابة AWS',
              description: 'Cloud infrastructure for scalability and reliability',
              descriptionAr: 'بنية تحتية سحابية للتوسع والموثوقية'
            }
          ]
        },
        results: {
          create: [
            {
              metric: '80%',
              metricAr: '80%',
              description: 'Reduction in manual reporting time',
              descriptionAr: 'تقليل وقت إعداد التقارير اليدوية'
            },
            {
              metric: '3x',
              metricAr: '3x',
              description: 'Faster data processing speed',
              descriptionAr: 'سرعة معالجة البيانات أسرع بثلاث مرات'
            },
            {
              metric: '95%',
              metricAr: '95%',
              description: 'Accuracy in predictive analytics',
              descriptionAr: 'دقة في التحليلات التنبؤية'
            },
            {
              metric: '50+',
              metricAr: '50+',
              description: 'Automated reports generated daily',
              descriptionAr: 'تقارير آلية يتم إنشاؤها يومياً'
            }
          ]
        },
        clientTestimonial: {
          create: {
            quote: 'The Smart Analytics Platform has revolutionized how we make data-driven decisions. The AI-powered insights have helped us identify opportunities we never knew existed, and the automated reporting has freed up our team to focus on strategic initiatives.',
            quoteAr: 'لقد غيرت منصة التحليلات الذكية طريقة اتخاذنا للقرارات القائمة على البيانات. ساعدتنا الرؤى المدعومة بالذكاء الاصطناعي في تحديد فرص لم نكن نعرف أنها موجودة، وأتاح لنا إعداد التقارير التلقائي التركيز على المبادرات الاستراتيجية.',
            author: 'David Martinez',
            authorAr: 'ديفيد مارتينيز',
            position: 'Chief Data Officer, TechCorp Industries',
            positionAr: 'مدير البيانات الرئيسي، TechCorp Industries'
          }
        },
        contentBlocks: {
          create: [
            {
              type: 'heading',
              order: 1,
              content: 'Project Overview',
              contentAr: 'نظرة عامة على المشروع',
              level: 2
            },
            {
              type: 'paragraph',
              order: 2,
              content: 'The Smart Analytics Platform represents a breakthrough in business intelligence technology. By combining cutting-edge AI algorithms with intuitive user interfaces, we created a solution that makes complex data analysis accessible to everyone in the organization.',
              contentAr: 'تمثل منصة التحليلات الذكية اختراقاً في تقنية ذكاء الأعمال. من خلال الجمع بين خوارزميات الذكاء الاصطناعي المتطورة وواجهات المستخدم البديهية، أنشأنا حلاً يجعل التحليل المعقد للبيانات في متناول الجميع في المؤسسة.'
            },
            {
              type: 'heading',
              order: 3,
              content: 'Key Features',
              contentAr: 'الميزات الرئيسية',
              level: 2
            },
            {
              type: 'paragraph',
              order: 4,
              content: 'The platform includes real-time data processing, predictive analytics, automated report generation, customizable dashboards, and advanced visualization tools. All features are designed with user experience in mind, ensuring that even non-technical users can leverage the power of AI-driven insights.',
              contentAr: 'تشمل المنصة معالجة البيانات في الوقت الفعلي والتحليلات التنبؤية وتوليد التقارير التلقائية ولوحات المعلومات القابلة للتخصيص وأدوات التصور المتقدمة. تم تصميم جميع الميزات مع مراعاة تجربة المستخدم، مما يضمن أن المستخدمين غير التقنيين يمكنهم الاستفادة من قوة الرؤى المدعومة بالذكاء الاصطناعي.'
            },
            {
              type: 'image',
              order: 5,
              src: '/api/placeholder/800/400',
              alt: 'Smart Analytics Platform Dashboard',
              altAr: 'لوحة معلومات منصة التحليلات الذكية',
              caption: 'The intuitive dashboard provides real-time insights at a glance',
              captionAr: 'توفر لوحة المعلومات البديهية رؤى في الوقت الفعلي في لمحة'
            }
          ]
        }
      }
    });

    console.log('✅ Created example project: Smart Analytics Platform');

    // Get or create blog category
    let blogCategory = await prisma.blogCategory.findFirst({
      where: { slug: 'ai-technology' }
    });

    if (!blogCategory) {
      blogCategory = await prisma.blogCategory.create({
        data: {
          name: 'AI & Technology',
          nameAr: 'الذكاء الاصطناعي والتكنولوجيا',
          slug: 'ai-technology',
          description: 'Latest trends and insights in artificial intelligence and technology',
          descriptionAr: 'أحدث الاتجاهات والرؤى في الذكاء الاصطناعي والتكنولوجيا',
          color: '#6812F7',
          icon: '🤖',
          featured: true
        }
      });
      console.log('✅ Created blog category: AI & Technology');
    }

    // Get or create blog author
    let blogAuthor = await prisma.blogAuthor.findFirst({
      where: { email: 'sarah.johnson@tasami.com' }
    });

    if (!blogAuthor) {
      blogAuthor = await prisma.blogAuthor.create({
        data: {
          name: 'Sarah Johnson',
          nameAr: 'سارة جونسون',
          role: 'AI Research Lead',
          roleAr: 'قائدة أبحاث الذكاء الاصطناعي',
          email: 'sarah.johnson@tasami.com',
          avatar: '👩‍💼',
          bio: 'Sarah is a leading AI researcher with over 10 years of experience in machine learning and business automation.',
          bioAr: 'سارة باحثة رائدة في الذكاء الاصطناعي مع أكثر من 10 سنوات من الخبرة في تعلم الآلة وأتمتة الأعمال.',
          socialLinks: {
            twitter: '@sarahjohnson',
            linkedin: 'sarah-johnson-ai'
          },
          expertise: ['Machine Learning', 'AI Research', 'Business Automation']
        }
      });
      console.log('✅ Created blog author: Sarah Johnson');
    }

    // Create example blog article
    const exampleArticle = await prisma.blogArticle.upsert({
      where: { slug: 'building-smart-analytics-platforms-with-ai' },
      update: {},
      create: {
        title: 'Building Smart Analytics Platforms with AI: A Complete Guide',
        titleAr: 'بناء منصات التحليلات الذكية بالذكاء الاصطناعي: دليل شامل',
        excerpt: 'Discover how to leverage artificial intelligence and machine learning to build powerful analytics platforms that transform raw data into actionable business insights.',
        excerptAr: 'اكتشف كيفية الاستفادة من الذكاء الاصطناعي وتعلم الآلة لبناء منصات تحليلات قوية تحول البيانات الخام إلى رؤى عمل قابلة للتنفيذ.',
        content: `
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            In today's data-driven world, businesses are generating more information than ever before. However, raw data alone isn't valuable—it's the insights we extract from it that drive decision-making and create competitive advantages. This is where smart analytics platforms powered by artificial intelligence come into play.
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Evolution of Analytics Platforms</h2>
          
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            Traditional analytics platforms required extensive manual work, from data collection to report generation. Analysts spent countless hours processing data, creating visualizations, and preparing reports. Today, AI-powered platforms automate these processes while providing deeper, more accurate insights.
          </p>

          <div class="bg-gradient-to-r from-[#6812F7] to-[#9253F0] p-8 rounded-2xl my-8">
            <h3 class="text-2xl font-bold text-white mb-4">Key Insight</h3>
            <p class="text-white/90 text-lg leading-relaxed">
              Companies using AI-powered analytics platforms report a 40% improvement in decision-making speed and a 35% increase in revenue from data-driven initiatives.
            </p>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Core Components of Smart Analytics Platforms</h2>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">1. Data Processing and Integration</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            Modern analytics platforms must handle data from multiple sources—databases, APIs, cloud services, and IoT devices. AI algorithms can automatically clean, normalize, and integrate this data, ensuring consistency and accuracy.
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">2. Machine Learning Models</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            Predictive analytics models can forecast trends, identify anomalies, and suggest actions. These models learn from historical data and continuously improve their accuracy over time.
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">3. Real-Time Processing</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            The ability to process and analyze data in real-time enables businesses to respond quickly to changing conditions. This is crucial for industries like finance, e-commerce, and logistics.
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">4. Automated Reporting</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            AI can automatically generate reports, dashboards, and visualizations tailored to different stakeholders. This saves time and ensures that everyone has access to the insights they need.
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Implementation Best Practices</h2>

          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            When building a smart analytics platform, consider these best practices:
          </p>

          <ul class="list-disc list-inside space-y-4 mb-8">
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">Start with Clear Objectives:</strong> Define what insights you need and how they'll drive business value.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">Ensure Data Quality:</strong> Implement robust data validation and cleaning processes from the start.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">Focus on User Experience:</strong> Make the platform intuitive so that non-technical users can leverage its power.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">Plan for Scalability:</strong> Design your architecture to handle growing data volumes and user bases.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">Iterate and Improve:</strong> Continuously refine your models and features based on user feedback and performance metrics.
            </li>
          </ul>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Future of Analytics</h2>

          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            As AI technology continues to evolve, we can expect analytics platforms to become even more intelligent. Natural language processing will allow users to query data using plain English, while advanced AI will automatically discover insights without explicit queries.
          </p>

          <p class="text-lg text-gray-600 leading-relaxed mb-8">
            The future belongs to organizations that can effectively harness the power of their data. By investing in smart analytics platforms today, you're positioning your business for success in an increasingly data-driven world.
          </p>
        `,
        contentAr: `
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            في عالم اليوم القائم على البيانات، تولد الشركات معلومات أكثر من أي وقت مضى. ومع ذلك، فإن البيانات الخام وحدها ليست قيمة—إنها الرؤى التي نستخرجها منها هي التي تدفع اتخاذ القرارات وتخلق مزايا تنافسية. هنا تأتي منصات التحليلات الذكية المدعومة بالذكاء الاصطناعي.
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">تطور منصات التحليلات</h2>
          
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            كانت منصات التحليلات التقليدية تتطلب عملاً يدوياً واسعاً، من جمع البيانات إلى إنشاء التقارير. قضى المحللون ساعات لا حصر لها في معالجة البيانات وإنشاء التصورات وإعداد التقارير. اليوم، تعمل المنصات المدعومة بالذكاء الاصطناعي على أتمتة هذه العمليات مع توفير رؤى أعمق وأكثر دقة.
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">المكونات الأساسية لمنصات التحليلات الذكية</h2>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">1. معالجة البيانات والتكامل</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            يجب أن تتعامل منصات التحليلات الحديثة مع البيانات من مصادر متعددة—قواعد البيانات وواجهات برمجة التطبيقات والخدمات السحابية وأجهزة إنترنت الأشياء. يمكن لخوارزميات الذكاء الاصطناعي تنظيف وتوحيد ودمج هذه البيانات تلقائياً، مما يضمن الاتساق والدقة.
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-6">2. نماذج تعلم الآلة</h3>
          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            يمكن لنماذج التحليلات التنبؤية التنبؤ بالاتجاهات وتحديد الشذوذات واقتراح الإجراءات. تتعلم هذه النماذج من البيانات التاريخية وتحسن دقتها باستمرار بمرور الوقت.
          </p>

          <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">ممارسات التنفيذ الأفضل</h2>

          <p class="text-lg text-gray-600 leading-relaxed mb-6">
            عند بناء منصة تحليلات ذكية، ضع في اعتبارك هذه الممارسات الأفضل:
          </p>

          <ul class="list-disc list-inside space-y-4 mb-8">
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">ابدأ بأهداف واضحة:</strong> حدد الرؤى التي تحتاجها وكيف ستقود قيمة الأعمال.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">تأكد من جودة البيانات:</strong> نفذ عمليات التحقق من البيانات وتنظيفها القوية من البداية.
            </li>
            <li class="text-lg text-gray-600">
              <strong class="text-gray-900">ركز على تجربة المستخدم:</strong> اجعل المنصة بديهية حتى يتمكن المستخدمون غير التقنيين من الاستفادة من قوتها.
            </li>
          </ul>
        `,
        slug: 'building-smart-analytics-platforms-with-ai',
        image: '/api/placeholder/800/400',
        readTime: '8 min read',
        featured: true,
        status: 'published',
        views: 0,
        tags: ['AI', 'Analytics', 'Machine Learning', 'Business Intelligence', 'Data Science', 'Technology'],
        relatedArticles: [],
        authorId: blogAuthor.id,
        categoryId: blogCategory.id
      }
    });

    console.log('✅ Created example blog article: Building Smart Analytics Platforms with AI');
    console.log('🎉 Example seeding completed successfully!');
    console.log('');
    console.log('📊 Example Project:');
    console.log('   - Title: Smart Analytics Platform');
    console.log('   - ID: example-smart-analytics-platform');
    console.log('   - View at: /work');
    console.log('');
    console.log('📝 Example Blog Article:');
    console.log('   - Title: Building Smart Analytics Platforms with AI: A Complete Guide');
    console.log('   - Slug: building-smart-analytics-platforms-with-ai');
    console.log('   - View at: /blog');
    console.log('   - Article page: /article/building-smart-analytics-platforms-with-ai');

  } catch (error) {
    console.error('❌ Error seeding examples:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedExamples()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

