'use strict';

const courseService = require('../services/course.service');

// List courses with optional search and status filter
exports.listCourses = async (req, res) => {
  try {
    const { search, status, limit = 50, offset = 0 } = req.query;
    const result = await courseService.getCourses(req.user.organizationId, {
      search,
      status,
      limit,
      offset
    });
    res.json({
      courses: result.rows,
      total: result.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get course counts for stats dashboard
exports.getStats = async (req, res) => {
  try {
    const stats = await courseService.getCourseCounts(req.user.organizationId);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single course by ID
exports.getCourse = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id, req.user.organizationId);
    res.json(course);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body, req.user.organizationId, req.user.userId);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update course by ID
exports.updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user.organizationId);
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user.organizationId);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Archive course (mark as archived instead of hard delete)
exports.archiveCourse = async (req, res) => {
  try {
    const course = await courseService.archiveCourse(req.params.id, req.user.organizationId);
    res.json({
      message: 'Course archived successfully',
      course
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
