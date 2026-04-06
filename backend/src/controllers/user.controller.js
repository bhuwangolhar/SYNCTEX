'use strict';

const userService = require('../services/user.service');
const isProduction = process.env.NODE_ENV === 'production';

exports.listUsers = async (req, res) => {
  try {
    const users = await userService.listUsers(req.user.organizationId);
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: 'Failed to list users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    const user = await userService.createUser(
      { name, email, mobile, password, role },
      req.user.organizationId,
      req.user.userId
    );

    try {
      await require('../services/branch.service').createDefaultUserBranch({
        organizationId: req.user.organizationId,
        createdBy: req.user.userId,
        ownerId: user.id,
        userName: user.name
      });
    } catch (error) {
      if (!isProduction) console.warn('Default branch creation failed');
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user.organizationId
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user' });
  }
};