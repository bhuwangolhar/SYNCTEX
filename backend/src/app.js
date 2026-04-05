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

app.use(cors());
app.use(express.json());

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

const ensureSchema = async () => {
  await sequelize.sync({ alter: true });

  const queryInterface = sequelize.getQueryInterface();
  const usersTable = await queryInterface.describeTable('users');

  if (!usersTable.mobile) {
    await queryInterface.addColumn('users', 'mobile', {
      type: DataTypes.STRING,
      allowNull: true
    });
    console.log('Added missing users.mobile column');
  }
};

sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connected');
    await ensureSchema();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB error:', err));
