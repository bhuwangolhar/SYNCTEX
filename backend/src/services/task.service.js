// task service

'use strict';

const Task = require('../models/task.model');

/**
 * organizationId always comes from req.user — never from the request body/query.
 */
exports.getTasks = async (organizationId) => {
  return await Task.findAll({ where: { organization_id: organizationId } });
};

exports.createTask = async (data, organizationId) => {
  if (!data.title) throw new Error('title is required');

  return await Task.create({
    ...data,
    organization_id: organizationId   // always use server-side org, ignore any client value
  });
};

exports.updateTask = async (id, data, organizationId) => {
  const task = await Task.findOne({ where: { id, organization_id: organizationId } });

  if (!task) throw new Error('Task not found in your organization');

  delete data.organization_id;  // prevent client from moving task to another org
  await task.update(data);
  return task;
};

exports.deleteTask = async (id, organizationId) => {
  const task = await Task.findOne({ where: { id, organization_id: organizationId } });

  if (!task) throw new Error('Task not found in your organization');

  await task.destroy();
  return true;
};