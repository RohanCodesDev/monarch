const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Check Users
    const userCount = await prisma.user.count();
    console.log('👥 Users in database:', userCount);
    
    if (userCount > 0) {
      const recentUsers = await prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          createdAt: true
        }
      });
      console.log('   Recent users:', recentUsers);
    }

    // Check Artworks
    console.log('\n🎨 Artworks in database:', await prisma.artwork.count());
    
    const artworkCount = await prisma.artwork.count();
    if (artworkCount > 0) {
      const recentArtworks = await prisma.artwork.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          artifactType: true,
          civilization: true,
          userId: true,
          createdAt: true
        }
      });
      console.log('   Recent artworks:', recentArtworks);
    }

    // Test queries
    console.log('\n🧪 Testing database queries...');
    
    // Check if database can write
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      console.log('   ✅ Read queries working');
    } catch (err) {
      console.error('   ❌ Read queries failed:', err.message);
    }

    console.log('\n📊 Database Summary:');
    console.log(`   - Total Users: ${userCount}`);
    console.log(`   - Total Artworks: ${artworkCount}`);
    console.log(`   - Database Status: ${userCount > 0 || artworkCount > 0 ? '✅ Active' : '⚠️  Empty but connected'}`);

  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    console.error('   Connection string:', process.env.DATABASE_URL ? 'Found' : 'Missing');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
