import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding job positions...');

  // Create 5 test job positions
  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are looking for a Senior Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
      requirements: [
        '5+ years of experience in full-stack development',
        'Proficiency in React, Node.js, and TypeScript',
        'Experience with databases (PostgreSQL, MongoDB)',
        'Knowledge of cloud platforms (AWS, Azure, or GCP)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Health, dental, and vision insurance',
        'Flexible work hours and remote work options',
        'Professional development budget',
        'Unlimited vacation policy'
      ],
      salary: '$120,000 - $160,000',
      applicationDeadline: '2024-12-31T23:59:59Z'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our design team as a UX/UI Designer to create beautiful and intuitive user experiences. You will work closely with product managers and developers to bring designs to life.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, or Adobe Creative Suite',
        'Strong portfolio showcasing user-centered design',
        'Experience with user research and testing',
        'Knowledge of design systems and accessibility'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health and dental insurance',
        'Design tools and software licenses',
        'Conference and training budget',
        'Flexible work arrangements'
      ],
      salary: '$90,000 - $120,000',
      applicationDeadline: '2024-12-15T23:59:59Z'
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'We are seeking an AI/ML Engineer to develop and implement machine learning solutions. You will work on cutting-edge AI projects and help shape the future of our products.',
      requirements: [
        '4+ years of experience in machine learning and AI',
        'Strong programming skills in Python and R',
        'Experience with ML frameworks (TensorFlow, PyTorch)',
        'Knowledge of data science and statistics',
        'Experience with cloud ML platforms'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Research and development budget',
        'Conference attendance and training',
        'Flexible work schedule'
      ],
      salary: '$130,000 - $180,000',
      applicationDeadline: '2024-12-20T23:59:59Z'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Lead our marketing efforts as a Marketing Manager. You will develop and execute marketing strategies to drive growth and brand awareness.',
      requirements: [
        '3+ years of marketing experience',
        'Experience with digital marketing channels',
        'Strong analytical and communication skills',
        'Knowledge of marketing automation tools',
        'Experience with content marketing and SEO'
      ],
      benefits: [
        'Competitive salary and bonus structure',
        'Health and dental insurance',
        'Marketing tools and software access',
        'Professional development opportunities',
        'Team building events'
      ],
      salary: '$80,000 - $110,000',
      applicationDeadline: '2024-12-10T23:59:59Z'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Join our DevOps team to build and maintain our infrastructure. You will ensure our systems are scalable, secure, and reliable.',
      requirements: [
        '4+ years of DevOps or infrastructure experience',
        'Experience with cloud platforms (AWS, Azure, GCP)',
        'Knowledge of containerization (Docker, Kubernetes)',
        'Experience with CI/CD pipelines',
        'Strong scripting skills (Bash, Python)'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Home office setup budget',
        'Training and certification support',
        'Flexible work arrangements'
      ],
      salary: '$110,000 - $150,000',
      applicationDeadline: '2024-12-25T23:59:59Z'
    }
  ];

  for (const jobData of jobs) {
    await prisma.job.create({
      data: jobData
    });
  }

  console.log('✅ Job positions seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding job positions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

