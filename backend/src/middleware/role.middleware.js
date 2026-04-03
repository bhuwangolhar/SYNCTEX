'use strict';

/**
 * Restricts access to users with the ADMIN role.
 * Must be used after authenticate middleware.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = { requireAdmin };