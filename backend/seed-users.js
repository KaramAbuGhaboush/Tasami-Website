const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tasami.com' },
      update: {},
      create: {
        email: 'admin@tasami.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
        isActive: true
      }
    });

    // Create employee user
    const employeePassword = await bcrypt.hash('employee123', 12);
    const employee = await prisma.user.upsert({
      where: { email: 'employee@tasami.com' },
      update: {},
      create: {
        email: 'employee@tasami.com',
        password: employeePassword,
        name: 'Employee User',
        role: 'employee',
        isActive: true
      }
    });

    console.log('✅ Users seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('🔑 Admin User:');
    console.log('   Email: admin@tasami.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('\n👤 Employee User:');
    console.log('   Email: employee@tasami.com');
    console.log('   Password: employee123');
    console.log('   Role: employee');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
