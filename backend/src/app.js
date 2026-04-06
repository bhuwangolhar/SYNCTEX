// app.js

'use strict';

const express = require('express');
const cors = require('cors');
const { DataTypes } = require('sequelize');
require('dotenv').config();

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

// Production-safe CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
    : true,
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

const ensureSchema = async () => {
  // In production, use migrations instead of sync
  if (!isProduction) {
    await sequelize.sync({ alter: true });
  }

  const queryInterface = sequelize.getQueryInterface();
  const usersTable = await queryInterface.describeTable('users');

  if (!usersTable.mobile) {
    await queryInterface.addColumn('users', 'mobile', {
      type: DataTypes.STRING,
      allowNull: true
    });
    if (!isProduction) console.log('Added missing users.mobile column');
  }
};

sequelize
  .authenticate()
  .then(async () => {
    if (!isProduction) console.log('Database connected');
    await ensureSchema();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });
