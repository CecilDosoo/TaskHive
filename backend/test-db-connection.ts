// Quick script to test database connection and list users
import prisma from './src/config/database';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully!\n');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}\n`);
    
    // List all users
    if (userCount > 0) {
      console.log('👥 Users in database:');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name} (${user.email})`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    } else {
      console.log('⚠️  No users found in database.');
      console.log('   Try registering a user through the frontend.\n');
    }
    
    await prisma.$disconnect();
    console.log('\n✅ Test completed!');
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

testConnection();








