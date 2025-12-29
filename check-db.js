const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
      }
    });

    console.log(`📊 Total users in database: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('👤 Users:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Username: @${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      });
    } else {
      console.log('⚠️  No users found in database.');
      console.log('   Try registering a user at http://localhost:3000/register');
    }

    // Get all artworks count
    const artworkCount = await prisma.artwork.count();
    console.log(`\n🎨 Total artworks saved: ${artworkCount}`);

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
