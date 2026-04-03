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
  const where = { organization_id: organizationId };
  if (status && status !== 'all') {
    where.course_status = status;
  }

  // Add search across course name and code
  if (search) {
    where[require('sequelize').Op.or] = [
      { course_name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { course_code: { [require('sequelize').Op.iLike]: `%${search}%` } }
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
    where: { id, organization_id: organizationId }
  });
  if (!course) throw new Error('Course not found');
  return course;
};

// Get course status counts for dashboard stats
exports.getCourseCounts = async (organizationId) => {
  const counts = await Course.findAll({
    where: { organization_id: organizationId },
    attributes: ['course_status', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
    group: ['course_status'],
    raw: true
  });
  
  // Build stats object with default 0 values
  const stats = { draft: 0, active: 0, archived: 0, total: 0 };
  counts.forEach(c => {
    if (c.course_status) stats[c.course_status] = parseInt(c.count);
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
      organization_id: organizationId,
      [require('sequelize').Op.or]: [
        { course_code: normalized_code },
        { course_slug: data.courseSlug.toLowerCase() }
      ]
    }
  });
  if (existing) throw new Error('Course code or slug already exists in this organization');

  // Create course with mapped fields
  return await Course.create({
    organization_id: organizationId,
    course_code: normalized_code,
    course_name: data.courseName.trim(),
    course_slug: data.courseSlug.toLowerCase(),
    description: data.description || null,
    delivery_mode: data.deliveryMode || 'online',
    course_type: data.courseType || null,
    course_status: data.courseStatus || 'draft',
    selling_price: data.sellingPrice || null,
    discounted_price: data.discountedPrice || null,
    gst_percentage: data.gstPercentage || 18.00,
    fee_plan: data.feePlan || null,
    language: data.language || 'English',
    show_on_homepage: Boolean(data.showOnHomepage),
    created_by: userId
  });
};

// Update course with org isolation and validation
exports.updateCourse = async (id, data, organizationId) => {
  const course = await Course.findOne({
    where: { id, organization_id: organizationId }
  });
  if (!course) throw new Error('Course not found');

  // Validate code if changing
  if (data.courseCode && data.courseCode !== course.course_code) {
    const normalized = normalizeCourseCode(data.courseCode);
    if (!validateCourseCode(normalized)) throw new Error('Invalid course code format');
    const dupe = await Course.findOne({
      where: {
        organization_id: organizationId,
        course_code: normalized,
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    if (dupe) throw new Error('Course code already exists');
  }

  // Validate slug if changing
  if (data.courseSlug && data.courseSlug !== course.course_slug) {
    if (!validateCourseSlug(data.courseSlug)) throw new Error('Invalid course slug format');
    const dupe = await Course.findOne({
      where: {
        organization_id: organizationId,
        course_slug: data.courseSlug.toLowerCase(),
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    if (dupe) throw new Error('Course slug already exists');
  }

  // Update fields
  const updatePayload = {
    course_code: data.courseCode ? normalizeCourseCode(data.courseCode) : course.course_code,
    course_name: data.courseName || course.course_name,
    course_slug: data.courseSlug ? data.courseSlug.toLowerCase() : course.course_slug,
    description: data.description !== undefined ? data.description : course.description,
    delivery_mode: data.deliveryMode || course.delivery_mode,
    course_type: data.courseType || course.course_type,
    course_status: data.courseStatus || course.course_status,
    selling_price: data.sellingPrice !== undefined ? data.sellingPrice : course.selling_price,
    discounted_price: data.discountedPrice !== undefined ? data.discountedPrice : course.discounted_price,
    gst_percentage: data.gstPercentage || course.gst_percentage,
    fee_plan: data.feePlan || course.fee_plan,
    language: data.language || course.language,
    show_on_homepage: data.showOnHomepage !== undefined ? Boolean(data.showOnHomepage) : course.show_on_homepage
  };

  await course.update(updatePayload);
  return course;
};

// Delete course with org isolation
exports.deleteCourse = async (id, organizationId) => {
  const course = await Course.findOne({
    where: { id, organization_id: organizationId }
  });
  if (!course) throw new Error('Course not found');
  await course.destroy();
  return true;
};

// Archive course (soft-ish delete via status)
exports.archiveCourse = async (id, organizationId) => {
  const course = await Course.findOne({
    where: { id, organization_id: organizationId }
  });
  if (!course) throw new Error('Course not found');
  await course.update({ course_status: 'archived' });
  return course;
};
