'use strict';

const Role = require('../models/role.model');

exports.getRoles = async (organizationId) => {
  return Role.findAll({ where: { organizationId }, order: [['name', 'ASC']] });
};

exports.createRole = async (organizationId, name, code, description) => {
  const exists = await Role.findOne({ where: { organizationId, name } });
  if (exists) throw new Error('Role already exists');
  return Role.create({ organizationId, name, code, description });
};

exports.deleteRole = async (id, organizationId) => {
  const role = await Role.findOne({ where: { id, organizationId } });
  if (!role) throw new Error('Role not found');
  await role.destroy();
  return true;
};

exports.updateRole = async (id, organizationId, name, code, description) => {
  const role = await Role.findOne({ where: { id, organizationId } });
  if (!role) throw new Error('Role not found');
  const exists = await Role.findOne({ where: { organizationId, name, id: { [require('sequelize').Op.ne]: id } } });
  if (exists) throw new Error('Role name already exists');
  return role.update({ name, code, description });
};
