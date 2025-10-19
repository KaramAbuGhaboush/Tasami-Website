import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testimonials = [
  {
    name: "John Smith",
    role: "CEO, TechCorp Solutions",
    company: "TechCorp Solutions",
    quote: "Tasami transformed our entire operation with their AI solutions. The results exceeded our expectations and our efficiency has improved by 40%. Their team's expertise and dedication are unmatched.",
    rating: 5,
    initials: "JS",
    featured: true,
    status: "active"
  },
  {
    name: "Maria Johnson",
    role: "CTO, InnovateLab",
    company: "InnovateLab",
    quote: "The automation solutions they built for us have saved us countless hours and reduced errors significantly. The ROI has been incredible, and the support team is always there when we need them.",
    rating: 5,
    initials: "MJ",
    featured: true,
    status: "active"
  },
  {
    name: "David Rodriguez",
    role: "Founder, StartupXYZ",
    company: "StartupXYZ",
    quote: "Their design team created an amazing user experience that our customers absolutely love. Our conversion rates have increased by 60%, and customer satisfaction is at an all-time high.",
    rating: 5,
    initials: "DR",
    featured: true,
    status: "active"
  },
  {
    name: "Sarah Chen",
    role: "VP of Operations, DataFlow Inc",
    company: "DataFlow Inc",
    quote: "The data analysis solutions provided by Tasami have revolutionized how we understand our business metrics. Their insights have led to a 35% increase in operational efficiency.",
    rating: 5,
    initials: "SC",
    featured: false,
    status: "active"
  },
  {
    name: "Michael Brown",
    role: "Director of Technology, CloudTech",
    company: "CloudTech",
    quote: "Tasami's cloud migration strategy was flawless. They reduced our infrastructure costs by 50% while improving performance. Their technical expertise is outstanding.",
    rating: 5,
    initials: "MB",
    featured: false,
    status: "active"
  }
];

async function seedTestimonials() {
  try {
    console.log('🌱 Seeding testimonials...');

    // Clear existing testimonials
    await prisma.testimonial.deleteMany();
    console.log('🗑️  Cleared existing testimonials');

    // Create testimonials
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      });
    }

    console.log(`✅ Created ${testimonials.length} testimonials`);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    throw error;
  }
}

async function main() {
  await seedTestimonials();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
