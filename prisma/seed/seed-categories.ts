import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: "All",
    slug: "all",
    description: "All project categories",
    color: "#6812F7",
    icon: "grid",
    featured: true,
    sortOrder: 0,
    status: "active"
  },
  {
    name: "AI Solutions",
    slug: "ai-solutions",
    description: "Artificial Intelligence and Machine Learning solutions",
    color: "#10B981",
    icon: "brain",
    featured: true,
    sortOrder: 1,
    status: "active"
  },
  {
    name: "Automation",
    slug: "automation",
    description: "Process automation and workflow optimization",
    color: "#F59E0B",
    icon: "cog",
    featured: true,
    sortOrder: 2,
    status: "active"
  },
  {
    name: "Design & UX/UI",
    slug: "design-ux-ui",
    description: "User experience and interface design",
    color: "#8B5CF6",
    icon: "palette",
    featured: true,
    sortOrder: 3,
    status: "active"
  },
  {
    name: "Marketing Solutions",
    slug: "marketing-solutions",
    description: "Digital marketing and growth strategies",
    color: "#EF4444",
    icon: "megaphone",
    featured: true,
    sortOrder: 4,
    status: "active"
  },
  {
    name: "Industry Solutions",
    slug: "industry-solutions",
    description: "Industry-specific solutions and implementations",
    color: "#06B6D4",
    icon: "building",
    featured: true,
    sortOrder: 5,
    status: "active"
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');

    // Clear existing categories
    await prisma.projectCategory.deleteMany();
    console.log('🗑️  Cleared existing categories');

    // Create categories
    for (const category of categories) {
      await prisma.projectCategory.create({
        data: category
      });
    }

    console.log(`✅ Created ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

async function main() {
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

