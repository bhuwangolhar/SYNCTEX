#!/usr/bin/env node

/**
 * This script resets the migration history in the database.
 * Use this when migrations have been rearranged or renamed.
 * Run: node scripts/reset-migrations.js
 */

require('dotenv').config();
const sequelize = require('../config/database');

const resetMigrations = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🧹 Clearing migration history from _sequelizemeta table...');
    await sequelize.query('DELETE FROM "_sequelizemeta"');
    console.log('✅ Migration history cleared');

    console.log('\n📝 Next steps:');
    console.log('1. Run migrations: npx sequelize-cli db:migrate --env production');
    console.log('2. Start the application: npm start');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetMigrations();
