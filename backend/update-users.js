const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateUsers() {
  try {
    // Update users with sample data
    const users = await prisma.user.findMany()
    
    const departments = ['Engineering', 'Content', 'Marketing', 'Design', 'Sales', 'Operations']
    const phones = ['+1 (555) 123-4567', '+1 (555) 987-6543', '+1 (555) 456-7890', '+1 (555) 234-5678']
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const department = departments[i % departments.length]
      const phone = phones[i % phones.length]
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          department: department,
          phone: phone
        }
      })
      
      console.log(`Updated user ${user.name} with department: ${department}, phone: ${phone}`)
    }
    
    console.log('All users updated successfully!')
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUsers()
