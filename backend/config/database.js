const { Sequelize } = require("sequelize");
require("dotenv").config();

// Log available environment variables (sanitized)
const hasDbUrl = !!process.env.DATABASE_URL;
const hasDbCredentials = !!process.env.DB_NAME && !!process.env.DB_USER && !!process.env.DB_HOST;
console.log('\n🗄️  Database Configuration Check:');
console.log('  - DATABASE_URL provided:', hasDbUrl);
console.log('  - DB_HOST provided:', !!process.env.DB_HOST);
console.log('  - DB_NAME provided:', !!process.env.DB_NAME);
console.log('  - DB_USER provided:', !!process.env.DB_USER);
console.log('  - DB_PASSWORD provided:', !!process.env.DB_PASSWORD);

if (!hasDbUrl && !hasDbCredentials) {
  console.error('\n❌ FATAL: No database configuration found!');
  console.error('   Please set either:');
  console.error('   1. DATABASE_URL environment variable, OR');
  console.error('   2. DB_HOST, DB_NAME, DB_USER, DB_PASSWORD environment variables');
  process.exit(1);
}

let sequelize;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (Render production)
  console.log('  ✅ Using: DATABASE_URL connection');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
    }
  });
} else {
  // Fall back to individual env variables (local dev)
  console.log('  ✅ Using: Individual DB credentials (DB_HOST, DB_NAME, DB_USER)');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      logging: false
    }
  );
}

module.exports = sequelize;