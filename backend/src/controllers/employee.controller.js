'use strict';

const employeeService = require('../services/employee.service');

exports.listEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getEmployees(req.user.organizationId, req.query.search || '', req.query.status || 'all');
    res.json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id, req.user.organizationId);
    res.json(employee);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body, req.user.organizationId, req.user.userId);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user.organizationId);
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployee(req.params.id, req.user.organizationId);
    res.json({ message: 'Employee removed' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
