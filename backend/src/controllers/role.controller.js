'use strict';

const service = require('../services/role.service');

exports.listRoles = async (req, res) => {
  try {
    const roles = await service.getRoles(req.user.organizationId);
    res.json(roles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const role = await service.createRole(req.user.organizationId, name, code, description);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const role = await service.updateRole(req.params.id, req.user.organizationId, name, code, description);
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await service.deleteRole(req.params.id, req.user.organizationId);
    res.json({ message: 'Role removed' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
