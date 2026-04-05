// organization routes

const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth.middleware');
const organizationController = require('../controllers/organization.controller');

router.use(authenticate);

// Get organization details
router.get('/:organizationId', organizationController.getOrganization);

// Update organization details
router.put('/:organizationId', organizationController.updateOrganization);

module.exports = router;
