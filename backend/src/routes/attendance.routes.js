'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const controller = require('../controllers/attendance.controller');

router.use(authenticate);

router.post('/punch-in', controller.punchIn);
router.post('/punch-out', controller.punchOut);
router.get('/today', controller.getToday);
router.get('/by-date', controller.getByDate);
router.post('/break/start', controller.startBreak);
router.post('/break/end', controller.endBreak);
router.patch('/session/:id/summary', controller.updateSessionSummary);

module.exports = router;
