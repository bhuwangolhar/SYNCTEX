#!/usr/bin/env node

/**
 * Environment Check Script
 * Verifies all required environment variables are set
 */

require('dotenv').config();

console.log('\n🔍 SYNCTEX Environment Check\n');
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('PORT:', process.env.PORT || 3000);
console.log('');

const required = {
  'DATABASE_URL (Production)': process.env.DATABASE_URL,
  'DB_HOST (Alternative)': process.env.DB_HOST,
  'DB_NAME (Alternative)': process.env.DB_NAME,
  'DB_USER (Alternative)': process.env.DB_USER,
  'DB_PASSWORD (Alternative)': process.env.DB_PASSWORD,
};

let hasError = false;

const hasDbUrl = !!process.env.DATABASE_URL;
const hasDbCredentials = process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD;

Object.entries(required).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}`);
});

console.log('\n📋 Summary:');
if (hasDbUrl) {
  console.log('✅ Database configured with DATABASE_URL (Production mode)');
} else if (hasDbCredentials) {
  console.log('✅ Database configured with individual credentials (Development mode)');
} else {
  console.log('❌ Database NOT configured - Missing required environment variables');
  hasError = true;
}

if (hasError) {
  console.log('\n🔧 For production (Render):');
  console.log('   Set DATABASE_URL in Render Dashboard > Environment');
  console.log('\n🔧 For local development:');
  console.log('   Create .env file with:');
  console.log('   DB_HOST=localhost');
  console.log('   DB_NAME=synctex_dev');
  console.log('   DB_USER=postgres');
  console.log('   DB_PASSWORD=your_password');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
  process.exit(0);
}
