const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All course routes require authentication
router.use(authenticate);

// List courses with optional filters
router.get('/', courseController.listCourses);

// Get course stats (counts by status)
router.get('/stats', courseController.getStats);

// Get single course by ID
router.get('/:id', courseController.getCourse);

// Create new course
router.post('/', courseController.createCourse);

// Update course by ID
router.put('/:id', courseController.updateCourse);

// Archive course (soft delete)
router.patch('/:id/archive', courseController.archiveCourse);

// Delete course by ID (hard delete)
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
