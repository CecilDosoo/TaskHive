#!/usr/bin/env node


const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting TaskHive Backend...\n');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl === 'undefined') {
  console.warn('⚠️  WARNING: DATABASE_URL is not set!');
  console.warn('⚠️  Skipping migrations. Server will start but database might not work.\n');
} else {
  console.log('📦 Running database migrations...\n');
  
  try {
    const prismaPath = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');
    const migrateCommand = `${prismaPath} migrate deploy || npx prisma migrate deploy`;
    
  
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: process.env,
      cwd: path.join(__dirname, '..'),
      shell: true,
    });
    console.log('\n✅ Migrations completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Migration error occurred.');
    console.warn('⚠️  Migrations failed, but continuing to start server...');
    console.warn('⚠️  You may need to run migrations manually later.\n');
   
  }
}


console.log('🌐 Starting server...\n');
try {
  require('../dist/server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

