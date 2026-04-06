#!/usr/bin/env node

/**
 * Production startup script
 * - Runs migrations
 * - Starts the server
 */

const { execSync } = require('child_process');

console.log('🚀 Starting SYNCTEX Backend...\n');

try {
  // Run migrations
  console.log('📋 Running database migrations...');
  execSync('npx sequelize-cli db:migrate --env production', { stdio: 'inherit' });
  
  console.log('\n✅ Migrations completed successfully\n');
  console.log('🔧 Starting server...\n');
  
  // Start the server
  execSync('node src/server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error during startup:', error.message);
  process.exit(1);
}
