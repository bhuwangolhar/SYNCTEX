'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const branchService = require('./branch.service');

/**
 * List all users in the authenticated admin's organization.
 */
exports.listUsers = async (organizationId) => {
  return await User.findAll({
    where: { organizationId },
    attributes: { exclude: ['password'] }
  });
};

/**
 * Manually create a user inside the admin's organization.
 * The admin sets the password; the user can change it later.
 */
exports.createUser = async ({ name, email, mobile, password, role }, organizationId, createdBy) => {
  const resolvedRole = role || 'EMPLOYEE';

  if (!name || !email || !password) {
    throw new Error('name, email, and password are required');
  }

  if (!['ADMIN', 'EMPLOYEE'].includes(resolvedRole)) {
    throw new Error('role must be ADMIN or EMPLOYEE');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('A user with that email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    mobile: mobile || null,
    password: hashedPassword,
    role: resolvedRole,
    organizationId
  });

  // create a user home branch for quick branch tracking
  await branchService.createDefaultUserBranch({
    organizationId,
    createdBy,
    ownerId: user.id,
    userName: user.name
  }).catch(() => {});

  const { password: _pw, ...safe } = user.toJSON();
  return safe;
};

/**
 * Update a user — admin can only update users in their own org.
 */
exports.updateUser = async (id, updates, organizationId) => {
  const user = await User.findOne({ where: { id, organizationId } });

  if (!user) throw new Error('User not found in your organization');

  // If updating password, re-hash
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  // Prevent changing organizationId through this route
  delete updates.organizationId;

  await user.update(updates);

  const { password: _pw, ...safe } = user.toJSON();
  return safe;
};
