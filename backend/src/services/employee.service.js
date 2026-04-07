'use strict';

const Employee = require('../models/employee.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');

const makeEmployeeId = () => `EMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

exports.getEmployees = async (organizationId, search = '', status = 'all') => {
  const where = { organizationId };

  if (status && status !== 'all') {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { employeeId: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const employees = await Employee.findAll({ where, order: [['createdAt', 'DESC']] });

  // Add organization admin user as employee-like record
  const admins = await User.findAll({
    where: { organizationId, role: 'ADMIN' }
  });

  const adminEmployees = admins.map((admin) => ({
    id: admin.id,
    organizationId: admin.organizationId,
    employeeId: `ADM-${admin.id.slice(0, 8)}`,
    firstName: admin.name,
    lastName: '',
    email: admin.email,
    phone: admin.mobile || null,
    department: 'Administration',
    role: 'ADMIN',
    status: 'active',
    dateOfJoining: null,
    createdBy: admin.id,
    createdAt: admin.createdAt || new Date(),
    updatedAt: admin.updatedAt || new Date(),
    is_system_admin: true
  }));

  return [...adminEmployees, ...employees];
};

exports.getEmployeeById = async (id, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organizationId } });
  if (!employee) throw new Error('Employee not found');
  return employee;
};

exports.createEmployee = async (payload, organizationId, userId) => {
  if (!payload.firstName || !payload.email) {
    throw new Error('Required fields: firstName, email');
  }

  const generatedEmployeeId = payload.employeeId?.trim() || makeEmployeeId();

  const existing = await Employee.findOne({
    where: {
      organizationId,
      employeeId: generatedEmployeeId
    }
  });
  if (existing) throw new Error('employeeId already exists');

  return Employee.create({
    organizationId,
    userId: payload.userId || null,
    employeeId: generatedEmployeeId,
    firstName: payload.firstName,
    lastName: payload.lastName || null,
    email: payload.email,
    phone: payload.phone || null,
    department: payload.department || null,
    role: payload.role || null,
    status: payload.status || 'active',
    dateOfJoining: payload.dateOfJoining || null,
    createdBy: userId
  });
};

exports.updateEmployee = async (id, payload, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organizationId } });
  if (!employee) throw new Error('Employee not found');

  if (payload.employeeId && payload.employeeId !== employee.employeeId) {
    const duplicate = await Employee.findOne({
      where: {
        organizationId,
        employeeId: payload.employeeId,
        id: { [Op.ne]: id }
      }
    });
    if (duplicate) throw new Error('employeeId already exists');
  }

  return employee.update({
    employeeId: payload.employeeId || employee.employeeId,
    firstName: payload.firstName || employee.firstName,
    lastName: payload.lastName !== undefined ? payload.lastName : employee.lastName,
    email: payload.email || employee.email,
    phone: payload.phone !== undefined ? payload.phone : employee.phone,
    department: payload.department !== undefined ? payload.department : employee.department,
    role: payload.role !== undefined ? payload.role : employee.role,
    status: payload.status || employee.status,
    dateOfJoining: payload.dateOfJoining || employee.dateOfJoining
  });
};

exports.deleteEmployee = async (id, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organizationId } });
  if (!employee) throw new Error('Employee not found');
  await employee.destroy();
  return true;
};
