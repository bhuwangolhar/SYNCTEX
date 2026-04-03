'use strict';

const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const controller = require('../controllers/user.controller');

// All user-management routes require a valid JWT AND admin role
router.use(authenticate, requireAdmin);

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);

module.exports = router;