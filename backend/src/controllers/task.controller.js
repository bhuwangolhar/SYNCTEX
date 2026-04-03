// task controller

'use strict';

const taskService = require('../services/task.service');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.organizationId);
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.organizationId);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.organizationId
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.organizationId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};