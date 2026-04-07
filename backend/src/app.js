// app.js

'use strict';

console.log('\n📌 Starting app initialization...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
console.log('DB_HOST set:', !!process.env.DB_HOST);
console.log('DB_NAME set:', !!process.env.DB_NAME);

const express = require('express');
const cors = require('cors');
const { DataTypes } = require('sequelize');
require('dotenv').config();

console.log('\n📌 Loading database configuration...');
const sequelize = require('../config/database');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const userRoutes = require('./routes/user.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const branchRoutes = require('./routes/branch.routes');
const employeeRoutes = require('./routes/employee.routes');
const courseRoutes = require('./routes/course.routes');
const departmentRoutes = require('./routes/department.routes');
const roleRoutes = require('./routes/role.routes');
const organizationRoutes = require('./routes/organization.routes');

const app = express();

// CORS configuration - allow specific origins
const corsOptions = {
  origin: [
    'http://localhost:5173',      // Development frontend
    'https://synctex.vercel.app'  // Production frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/organizations', organizationRoutes);

app.get('/', (req, res) => {
  res.send('SYNCTEX API running');
});

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

console.log('\n⚙️  Application Configuration:');
console.log('  - PORT:', PORT);
console.log('  - NODE_ENV:', isProduction ? 'production' : 'development');

const ensureSchema = async () => {
  // In production, use migrations instead of sync
  if (!isProduction) {
    console.log('📋 Database sync (development only)...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
  } else {
    console.log('🔒 Production mode - skipping sync (migrations handle schema)');
  }
};

sequelize
  .authenticate()
  .then(async () => {
    console.log('\n✅ Database authenticated successfully');
    await ensureSchema();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server listening on port ${PORT}`);
      console.log('🌍 Ready to accept requests\n');
    });
  })
  .catch((err) => {
    console.error('\n❌ STARTUP FAILED - Database connection error\n');
    console.error('Error message:', err?.message || 'Unknown error');
    console.error('Error code:', err?.code || 'N/A');
    console.error('Error original:', err?.original?.message || 'N/A');
    console.error('\n🔍 Debug info:');
    console.error('  - DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.error('  - DB_HOST set:', !!process.env.DB_HOST);
    console.error('  - NODE_ENV:', process.env.NODE_ENV);
    console.error('\n💡 Next steps:');
    console.error('  1. Verify DATABASE_URL in Render environment variables');
    console.error('  2. Check PostgreSQL server is running and accessible');
    console.error('  3. Verify credentials in DATABASE_URL are correct');
    console.error('  4. Run "npm run check-env" locally to verify setup');
    
    if (err?.original) {
      console.error('\nFull error details:', err.original);
    }
    
    process.exit(1);
  });
