'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const controller = require('../controllers/branch.controller');

router.use(authenticate);

router.get('/', controller.getBranches);
router.get('/:id', controller.getBranch);
router.post('/', controller.createBranch);
router.put('/:id', controller.updateBranch);
router.delete('/:id', controller.deleteBranch);

module.exports = router;
