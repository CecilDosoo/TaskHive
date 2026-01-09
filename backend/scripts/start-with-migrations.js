#!/usr/bin/env node

/**
 * Start script that runs migrations before starting the server
 * Handles errors gracefully so server still starts even if migrations fail
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting TaskHive Backend...\n');

// Check if DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl === 'undefined') {
  console.warn('⚠️  WARNING: DATABASE_URL is not set!');
  console.warn('⚠️  Skipping migrations. Server will start but database might not work.\n');
} else {
  console.log('📦 Running database migrations...\n');
  
  try {
    const prismaPath = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');
    const migrateCommand = `${prismaPath} migrate deploy || npx prisma migrate deploy`;
    
    // Run migrations
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
    // Don't exit - continue to start the server anyway
  }
}

// Start the server
console.log('🌐 Starting server...\n');
try {
  require('../dist/server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

