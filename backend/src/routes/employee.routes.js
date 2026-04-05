const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', employeeController.listEmployees);
router.get('/:id', employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
