import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Latest technology trends and innovations",
    color: "#3B82F6",
    icon: "💻",
    featured: true
  },
  {
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    description: "Artificial Intelligence and Machine Learning insights",
    color: "#10B981",
    icon: "🤖",
    featured: true
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend and backend development guides",
    color: "#8B5CF6",
    icon: "🌐",
    featured: true
  },
  {
    name: "Business",
    slug: "business",
    description: "Business strategies and insights",
    color: "#F59E0B",
    icon: "💼",
    featured: false
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design and creative processes",
    color: "#EF4444",
    icon: "🎨",
    featured: false
  }
];

async function seedBlogCategories() {
  try {
    console.log('🌱 Seeding blog categories...');

    // Clear existing categories
    await prisma.blogCategory.deleteMany();
    console.log('🗑️  Cleared existing blog categories');

    // Create categories
    for (const category of categories) {
      await prisma.blogCategory.create({
        data: category
      });
    }

    console.log(`✅ Created ${categories.length} blog categories`);
  } catch (error) {
    console.error('❌ Error seeding blog categories:', error);
    throw error;
  }
}

async function main() {
  await seedBlogCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
