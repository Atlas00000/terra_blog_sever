import { prisma } from '../lib/prisma';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    const postCount = await prisma.post.count();
    console.log(`✅ Found ${postCount} posts in database`);
    
    const categoryCount = await prisma.category.count();
    console.log(`✅ Found ${categoryCount} categories in database`);
    
    console.log('✅ All database tests passed!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

