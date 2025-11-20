import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tasami.com' },
    update: {},
    create: {
      email: 'admin@tasami.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });

  console.log('✅ Admin user created');

  // Create blog authors
  const author1 = await prisma.blogAuthor.upsert({
    where: { email: 'sarah@tasami.com' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      role: 'AI Research Lead',
      email: 'sarah@tasami.com',
      avatar: '👩‍💼',
      bio: 'Sarah is a leading AI researcher with over 10 years of experience in machine learning and business automation.',
      socialLinks: {
        twitter: 'https://twitter.com/sarah',
        linkedin: 'https://linkedin.com/in/sarah',
        github: 'https://github.com/sarah'
      },
      expertise: ['AI', 'Machine Learning', 'Business Automation', 'Data Science']
    }
  });

  const author2 = await prisma.blogAuthor.upsert({
    where: { email: 'michael@tasami.com' },
    update: {},
    create: {
      name: 'Michael Chen',
      role: 'Automation Specialist',
      email: 'michael@tasami.com',
      avatar: '👨‍💻',
      bio: 'Michael specializes in helping small businesses implement automation solutions that drive growth and efficiency.',
      socialLinks: {
        twitter: 'https://twitter.com/michael',
        linkedin: 'https://linkedin.com/in/michael'
      },
      expertise: ['Automation', 'Process Optimization', 'Workflow Design']
    }
  });

  console.log('✅ Blog authors created');

  // Create blog categories
  const category1 = await prisma.blogCategory.upsert({
    where: { slug: 'ai-technology' },
    update: {},
    create: {
      name: 'AI & Technology',
      slug: 'ai-technology',
      description: 'Latest trends and insights in artificial intelligence and technology',
      color: '#6812F7',
      icon: '🤖',
      featured: true,
      seoTitle: 'AI & Technology Articles',
      seoDescription: 'Explore the latest in AI and technology'
    }
  });

  const category2 = await prisma.blogCategory.upsert({
    where: { slug: 'automation' },
    update: {},
    create: {
      name: 'Automation',
      slug: 'automation',
      description: 'Business process automation and workflow optimization',
      color: '#9253F0',
      icon: '⚙️',
      featured: true
    }
  });

  console.log('✅ Blog categories created');

  // Create blog articles
  const article1 = await prisma.blogArticle.upsert({
    where: { slug: 'the-future-of-ai-in-business' },
    update: {},
    create: {
      title: 'The Future of AI in Business: Trends to Watch in 2024',
      excerpt: 'Explore the latest AI trends that are reshaping how businesses operate, from automation to predictive analytics.',
      content: '<p>Artificial Intelligence is no longer a futuristic concept...</p>',
      slug: 'the-future-of-ai-in-business',
      image: '🤖',
      readTime: '5',
      featured: true,
      status: 'published',
      tags: ['AI', 'Business', 'Technology', 'Automation', 'Future Trends'],
      relatedArticles: [
        {
          title: 'How Automation is Transforming Small Businesses',
          slug: 'how-automation-is-transforming-small-businesses',
          category: 'Automation',
          readTime: '4 min read'
        }
      ],
      authorId: author1.id,
      categoryId: category1.id
    }
  });

  const article2 = await prisma.blogArticle.upsert({
    where: { slug: 'how-automation-is-transforming-small-businesses' },
    update: {},
    create: {
      title: 'How Automation is Transforming Small Businesses',
      excerpt: 'Discover how small businesses can leverage automation to compete with larger enterprises and scale efficiently.',
      content: '<p>Small businesses are discovering that automation isn\'t just for large corporations anymore...</p>',
      slug: 'how-automation-is-transforming-small-businesses',
      image: '⚙️',
      readTime: '4',
      featured: false,
      status: 'published',
      tags: ['Automation', 'Small Business', 'Efficiency', 'Growth'],
      relatedArticles: [
        {
          title: 'The Future of AI in Business: Trends to Watch in 2024',
          slug: 'the-future-of-ai-in-business',
          category: 'AI & Technology',
          readTime: '5 min read'
        }
      ],
      authorId: author2.id,
      categoryId: category2.id
    }
  });

  console.log('✅ Blog articles created');

  // Create project category first
  const projectCategory = await prisma.projectCategory.upsert({
    where: { slug: 'ai-solutions' },
    update: {},
    create: {
      name: 'AI Solutions',
      slug: 'ai-solutions',
      description: 'Artificial Intelligence and Machine Learning solutions',
      color: '#10B981',
      icon: 'brain',
      featured: true,
      sortOrder: 1,
      status: 'active'
    }
  });

  // Create projects
  const project1 = await prisma.project.upsert({
    where: { id: 'ai-ecommerce' },
    update: {},
    create: {
      id: 'ai-ecommerce',
      title: 'AI-Powered E-commerce Platform',
      description: 'Built a comprehensive e-commerce solution with AI-driven product recommendations, automated inventory management, and intelligent customer service chatbots.',
      headerImage: '/api/placeholder/1200/600',
      challenge: 'Our client needed a modern e-commerce platform that could handle high traffic while providing personalized shopping experiences.',
      solution: 'We developed a full-stack e-commerce platform powered by machine learning algorithms for product recommendations.',
      timeline: '6 months',
      teamSize: '8 developers',
      status: 'active',
      categoryId: projectCategory.id,
      technologies: {
        create: [
          { name: 'Machine Learning', description: 'Custom recommendation engine using collaborative filtering', nameAr: 'تعلم الآلة', descriptionAr: 'محرك توصيات مخصص باستخدام التصفية التعاونية' },
          { name: 'React', description: 'Modern frontend with responsive design', nameAr: 'رياكت', descriptionAr: 'واجهة أمامية حديثة بتصميم متجاوب' },
          { name: 'Node.js', description: 'Scalable backend API architecture', nameAr: 'نود جي إس', descriptionAr: 'هندسة API خلفية قابلة للتوسع' }
        ]
      },
      results: {
        create: [
          { metric: '40%', description: 'Increase in sales conversion rate', metricAr: '40%', descriptionAr: 'زيادة في معدل تحويل المبيعات' },
          { metric: '60%', description: 'Reduction in customer support tickets', metricAr: '60%', descriptionAr: 'تقليل تذاكر دعم العملاء' }
        ]
      },
      clientTestimonial: {
        create: {
          quote: 'The AI-powered platform transformed our business completely. Sales increased by 40% within the first quarter, and our customers love the personalized experience.',
          author: 'Sarah Johnson',
          position: 'CEO, ShopTech Solutions',
          quoteAr: 'لقد غيرت المنصة المدعومة بالذكاء الاصطناعي أعمالنا بالكامل. زادت المبيعات بنسبة 40% في الربع الأول، ويحب عملاؤنا التجربة الشخصية.',
          authorAr: 'سارة جونسون',
          positionAr: 'الرئيس التنفيذي، ShopTech Solutions'
        }
      }
    }
  });

  console.log('✅ Projects created');

  // Create jobs
  const job1 = await prisma.job.upsert({
    where: { id: 'senior-ai-engineer' },
    update: {},
    create: {
      id: 'senior-ai-engineer',
      title: 'Senior AI Engineer',
      department: 'AI & Technology',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of cutting-edge AI solutions and machine learning models for our clients.',
      requirements: [
        'Master\'s degree in Computer Science, AI, or related field',
        '5+ years experience in machine learning and AI development',
        'Proficiency in Python, TensorFlow, PyTorch',
        'Experience with cloud platforms (AWS, GCP, Azure)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work',
        'Learning budget',
        'Stock options'
      ],
      status: 'active'
    }
  });

  const job2 = await prisma.job.upsert({
    where: { id: 'ux-ui-designer' },
    update: {},
    create: {
      id: 'ux-ui-designer',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote / New York',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Create exceptional user experiences and beautiful interfaces for web and mobile applications.',
      requirements: [
        'Bachelor\'s degree in Design or related field',
        '3+ years experience in UX/UI design',
        'Proficiency in Figma, Sketch, Adobe Creative Suite',
        'Portfolio demonstrating strong design skills',
        'Experience with design systems and prototyping'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work',
        'Design tools budget',
        'Flexible hours'
      ],
      status: 'active'
    }
  });

  console.log('✅ Jobs created');

  // Create sample employees
  const employee1 = await prisma.employee.create({
    data: {
      name: 'Sarah Johnson',
      position: 'AI Research Lead',
      email: 'sarah.employee@tasami.com',
      department: 'AI & Technology',
      salary: 85000,
      hireDate: new Date('2023-01-15'),
      status: 'active',
      benefits: ['Health insurance', '401k matching', 'Remote work', 'Learning budget']
    }
  });

  const employee2 = await prisma.employee.create({
    data: {
      name: 'Michael Chen',
      position: 'Automation Specialist',
      email: 'michael.employee@tasami.com',
      department: 'Automation',
      salary: 75000,
      hireDate: new Date('2023-03-01'),
      status: 'active',
      benefits: ['Health insurance', '401k matching', 'Remote work', 'Professional development']
    }
  });

  console.log('✅ Sample employees created');

  // Create sample salaries
  const salary1 = await prisma.salary.create({
    data: {
      employeeId: employee1.id,
      amount: 85000,
      frequency: 'annual',
      lastPaid: new Date('2024-02-01'),
      nextPayment: new Date('2024-03-01'),
      status: 'active',
      deductions: {
        federalTax: 17000,
        stateTax: 8500,
        socialSecurity: 5270,
        medicare: 1232.5,
        healthInsurance: 2400,
        retirement401k: 8500
      },
      netPay: 50097.5
    }
  });

  console.log('✅ Sample salaries created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

