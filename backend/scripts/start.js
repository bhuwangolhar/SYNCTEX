#!/usr/bin/env node

/**
 * Production startup script
 * - Checks environment variables
 * - Runs migrations
 * - Starts the server
 */

const { execSync } = require('child_process');

console.log('🚀 Starting SYNCTEX Backend...\n');

try {
  // First check environment
  console.log('🔍 Checking environment variables...');
  execSync('node scripts/check-env.js', { stdio: 'inherit' });
  
  console.log('\n📋 Running database migrations...');
  execSync('npx sequelize-cli db:migrate --env production', { stdio: 'inherit' });
  
  console.log('\n✅ Migrations completed successfully\n');
  console.log('🔧 Starting server...\n');
  
  // Start the server
  execSync('node src/server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error during startup');
  console.error('Message:', error.message);
  console.error('Status:', error.status || 'unknown');
  if (error.output) {
    console.error('Output:', error.output.join('\n'));
  }
  process.exit(error.status || 1);
}
