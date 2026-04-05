const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', controller.listRoles);
router.post('/', controller.createRole);
router.put('/:id', controller.updateRole);
router.delete('/:id', controller.deleteRole);

module.exports = router;
