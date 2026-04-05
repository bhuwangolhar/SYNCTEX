'use strict';

const Department = require('../models/department.model');

exports.getDepartments = async (organizationId) => {
  return Department.findAll({ where: { organization_id: organizationId }, order: [['name', 'ASC']] });
};

exports.createDepartment = async (organizationId, name, code, description) => {
  const exists = await Department.findOne({ where: { organization_id: organizationId, name } });
  if (exists) throw new Error('Department already exists');
  return Department.create({ organization_id: organizationId, name, code, description });
};

exports.deleteDepartment = async (id, organizationId) => {
  const item = await Department.findOne({ where: { id, organization_id: organizationId } });
  if (!item) throw new Error('Department not found');
  await item.destroy();
  return true;
};

exports.updateDepartment = async (id, organizationId, name, code, description) => {
  const item = await Department.findOne({ where: { id, organization_id: organizationId } });
  if (!item) throw new Error('Department not found');
  const exists = await Department.findOne({ where: { organization_id: organizationId, name, id: { [require('sequelize').Op.ne]: id } } });
  if (exists) throw new Error('Department name already exists');
  return item.update({ name, code, description });
};
