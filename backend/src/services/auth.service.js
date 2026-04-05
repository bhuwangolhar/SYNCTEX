// auth service

'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Organization = require('../models/organization.model');
const branchService = require('./branch.service');

/**
 * Creates a new organization and its first ADMIN user.
 * This is the only public registration path.
 */
exports.register = async ({ name, email, password, organizationName, mobile }) => {
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Valid email is required');
  }

  const existingUser = await User.findOne({ where: { email: cleanEmail } });

  if (existingUser) {
    throw new Error('User already exists');
  }

  if (!name || !password || !organizationName) {
    throw new Error('name, email, password, and organizationName are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const organization = await Organization.create({ 
    name: organizationName,
    founder_name: name 
  });

  const user = await User.create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    role: 'ADMIN',
    organization_id: organization.id,
    mobile: mobile || null
  });

  try {
    // ensure home branch exists for this organization and admin user
    await branchService.createDefaultHomeBranch({
      organizationId: organization.id,
      createdBy: user.id,
      ownerId: user.id,
      orgName: organizationName,
      email: cleanEmail,
      phone: mobile || '+911234567890'
    });
  } catch (err) {
    // ignore branch create errors; user signup should succeed
    console.warn('Branch creation after registration failed:', err.message);
  }

  const token = _signToken(user, organization.id);

  return { user: _safeUser(user, organization.name), token };
};

/**
 * Authenticates any user (ADMIN or EMPLOYEE).
 */
exports.login = async ({ email, password }) => {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ where: { email: cleanEmail } });

  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = _signToken(user, user.organization_id);
  const organization = await Organization.findByPk(user.organization_id);

  return { user: _safeUser(user, organization?.name || ''), token };
};

// ── helpers ────────────────────────────────────────────────────────────────

function _signToken(user, organizationId) {
  return jwt.sign(
    {
      userId: user.id,
      organizationId,
      role: user.role          // include role so middleware can read it without a DB call
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function _safeUser(user, organizationName = '') {
  // Never return the hashed password to the client
  const { password, ...safe } = user.toJSON ? user.toJSON() : user;
  return {
    ...safe,
    organization_name: organizationName
  };
}
