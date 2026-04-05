'use strict';

const service = require('../services/department.service');

exports.listDepartments = async (req, res) => {
  try {
    const departments = await service.getDepartments(req.user.organizationId);
    res.json(departments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const department = await service.createDepartment(req.user.organizationId, name, code, description);
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const department = await service.updateDepartment(req.params.id, req.user.organizationId, name, code, description);
    res.json(department);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await service.deleteDepartment(req.params.id, req.user.organizationId);
    res.json({ message: 'Department removed' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
