'use strict';

const Employee = require('../models/employee.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');

const makeEmployeeId = () => `EMP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

exports.getEmployees = async (organizationId, search = '', status = 'all') => {
  const where = { organization_id: organizationId };

  if (status && status !== 'all') {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      { first_name: { [Op.iLike]: `%${search}%` } },
      { last_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { employee_id: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const employees = await Employee.findAll({ where, order: [['createdAt', 'DESC']] });

  // Add organization admin user as employee-like record
  const admins = await User.findAll({
    where: { organization_id: organizationId, role: 'ADMIN' }
  });

  const adminEmployees = admins.map((admin) => ({
    id: admin.id,
    organization_id: admin.organization_id,
    employee_id: `ADM-${admin.id.slice(0, 8)}`,
    first_name: admin.name,
    last_name: '',
    email: admin.email,
    phone: admin.mobile || null,
    department: 'Administration',
    role: 'ADMIN',
    status: 'active',
    date_of_joining: null,
    created_by: admin.id,
    createdAt: admin.createdAt || new Date(),
    updatedAt: admin.updatedAt || new Date(),
    is_system_admin: true
  }));

  return [...adminEmployees, ...employees];
};

exports.getEmployeeById = async (id, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organization_id: organizationId } });
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
      organization_id: organizationId,
      employee_id: generatedEmployeeId
    }
  });
  if (existing) throw new Error('employeeId already exists');

  return Employee.create({
    organization_id: organizationId,
    user_id: payload.userId || null,
    employee_id: generatedEmployeeId,
    first_name: payload.firstName,
    last_name: payload.lastName || null,
    email: payload.email,
    phone: payload.phone || null,
    department: payload.department || null,
    role: payload.role || null,
    status: payload.status || 'active',
    date_of_joining: payload.dateOfJoining || null,
    created_by: userId
  });
};

exports.updateEmployee = async (id, payload, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organization_id: organizationId } });
  if (!employee) throw new Error('Employee not found');

  if (payload.employeeId && payload.employeeId !== employee.employee_id) {
    const duplicate = await Employee.findOne({
      where: {
        organization_id: organizationId,
        employee_id: payload.employeeId,
        id: { [Op.ne]: id }
      }
    });
    if (duplicate) throw new Error('employeeId already exists');
  }

  return employee.update({
    employee_id: payload.employeeId || employee.employee_id,
    first_name: payload.firstName || employee.first_name,
    last_name: payload.lastName !== undefined ? payload.lastName : employee.last_name,
    email: payload.email || employee.email,
    phone: payload.phone !== undefined ? payload.phone : employee.phone,
    department: payload.department !== undefined ? payload.department : employee.department,
    role: payload.role !== undefined ? payload.role : employee.role,
    status: payload.status || employee.status,
    date_of_joining: payload.dateOfJoining || employee.date_of_joining
  });
};

exports.deleteEmployee = async (id, organizationId) => {
  const employee = await Employee.findOne({ where: { id, organization_id: organizationId } });
  if (!employee) throw new Error('Employee not found');
  await employee.destroy();
  return true;
};
