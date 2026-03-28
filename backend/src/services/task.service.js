const Task = require("../models/task.model");

exports.getTasks = async (organization_id) => {
  return await Task.findAll({ where: { organization_id } });
};

exports.createTask = async (data) => {
  if (!data.title || !data.organization_id) {
    throw new Error("Missing required fields");
  }

  return await Task.create(data);
};

exports.updateTask = async (id, data) => {
  const task = await Task.findByPk(id);

  if (!task) throw new Error("Task not found");

  await task.update(data);
  return task;
};

exports.deleteTask = async (id) => {
  const task = await Task.findByPk(id);

  if (!task) throw new Error("Task not found");

  await task.destroy();
  return true;
};