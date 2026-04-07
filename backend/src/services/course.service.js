'use strict';

const Course = require('../models/course.model');

// Normalize course code to uppercase for consistency
const normalizeCourseCode = (code) => code.toUpperCase().replace(/[^A-Z0-9-_]/g, '');

// Validate course code format
const validateCourseCode = (code) => {
  const normalized = normalizeCourseCode(code);
  return normalized.length >= 2 && normalized.length <= 50;
};

// Validate course slug (URL-friendly format)
const validateCourseSlug = (slug) => {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 255;
};

// Get all courses with optional filters and search
exports.getCourses = async (organizationId, filters = {}) => {
  const { search, status, limit = 50, offset = 0 } = filters;
  
  // Build where clause for organization and optional status filter
  const where = { organizationId };
  if (status && status !== 'all') {
    where.courseStatus = status;
  }

  // Add search across course name and code
  if (search) {
    where[require('sequelize').Op.or] = [
      { courseName: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { courseCode: { [require('sequelize').Op.iLike]: `%${search}%` } }
    ];
  }

  return await Course.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });
};

// Get single course by ID with org isolation
exports.getCourseById = async (id, organizationId) => {
  const course = await Course.findOne({
    where: { id, organizationId }
  });
  if (!course) throw new Error('Course not found');
  return course;
};

// Get course status counts for dashboard stats
exports.getCourseCounts = async (organizationId) => {
  const counts = await Course.findAll({
    where: { organizationId },
    attributes: ['courseStatus', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
    group: ['courseStatus'],
    raw: true
  });
  
  // Build stats object with default 0 values
  const stats = { draft: 0, active: 0, archived: 0, total: 0 };
  counts.forEach(c => {
    if (c.courseStatus) stats[c.courseStatus] = parseInt(c.count);
  });
  stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
  return stats;
};

// Create new course with validation
exports.createCourse = async (data, organizationId, userId) => {
  // Validate required fields
  const normalized_code = normalizeCourseCode(data.courseCode);
  if (!validateCourseCode(normalized_code)) throw new Error('Invalid course code format');
  if (!validateCourseSlug(data.courseSlug)) throw new Error('Invalid course slug format');
  if (!data.courseName || data.courseName.trim().length === 0) throw new Error('Course name is required');

  // Check for duplicate code and slug in org
  const existing = await Course.findOne({
    where: {
      organizationId,
      [require('sequelize').Op.or]: [
        { courseCode: normalized_code },
        { courseSlug: data.courseSlug.toLowerCase() }
      ]
    }
  });
  if (existing) throw new Error('Course code or slug already exists in this organization');

  // Create course with mapped fields
  return await Course.create({
    organizationId,
    courseCode: normalized_code,
    courseName: data.courseName.trim(),
    courseSlug: data.courseSlug.toLowerCase(),
    description: data.description || null,
    deliveryMode: data.deliveryMode || 'online',
    courseType: data.courseType || null,
    courseStatus: data.courseStatus || 'draft',
    sellingPrice: data.sellingPrice || null,
    discountedPrice: data.discountedPrice || null,
    gstPercentage: data.gstPercentage || 18.00,
    feePlan: data.feePlan || null,
    language: data.language || 'English',
    showOnHomepage: Boolean(data.showOnHomepage),
    createdBy: userId
  });
};

// Update course with org isolation and validation
exports.updateCourse = async (id, data, organizationId) => {
  const course = await Course.findOne({
    where: { id, organizationId }
  });
  if (!course) throw new Error('Course not found');

  // Validate code if changing
  if (data.courseCode && data.courseCode !== course.courseCode) {
    const normalized = normalizeCourseCode(data.courseCode);
    if (!validateCourseCode(normalized)) throw new Error('Invalid course code format');
    const dupe = await Course.findOne({
      where: {
        organizationId,
        courseCode: normalized,
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    if (dupe) throw new Error('Course code already exists');
  }

  // Validate slug if changing
  if (data.courseSlug && data.courseSlug !== course.courseSlug) {
    if (!validateCourseSlug(data.courseSlug)) throw new Error('Invalid course slug format');
    const dupe = await Course.findOne({
      where: {
        organizationId,
        courseSlug: data.courseSlug.toLowerCase(),
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    if (dupe) throw new Error('Course slug already exists');
  }

  // Update fields
  const updatePayload = {
    courseCode: data.courseCode ? normalizeCourseCode(data.courseCode) : course.courseCode,
    courseName: data.courseName || course.courseName,
    courseSlug: data.courseSlug ? data.courseSlug.toLowerCase() : course.courseSlug,
    description: data.description !== undefined ? data.description : course.description,
    deliveryMode: data.deliveryMode || course.deliveryMode,
    courseType: data.courseType || course.courseType,
    courseStatus: data.courseStatus || course.courseStatus,
    sellingPrice: data.sellingPrice !== undefined ? data.sellingPrice : course.sellingPrice,
    discountedPrice: data.discountedPrice !== undefined ? data.discountedPrice : course.discountedPrice,
    gstPercentage: data.gstPercentage || course.gstPercentage,
    feePlan: data.feePlan || course.feePlan,
    language: data.language || course.language,
    showOnHomepage: data.showOnHomepage !== undefined ? Boolean(data.showOnHomepage) : course.showOnHomepage
  };

  await course.update(updatePayload);
  return course;
};

// Delete course with org isolation
exports.deleteCourse = async (id, organizationId) => {
  const course = await Course.findOne({
    where: { id, organizationId }
  });
  if (!course) throw new Error('Course not found');
  await course.destroy();
  return true;
};

// Archive course (soft-ish delete via status)
exports.archiveCourse = async (id, organizationId) => {
  const course = await Course.findOne({
    where: { id, organizationId }
  });
  if (!course) throw new Error('Course not found');
  await course.update({ courseStatus: 'archived' });
  return course;
};
