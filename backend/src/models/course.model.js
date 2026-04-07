'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'organization_id'
  },
  courseCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
    field: 'course_code'
  },
  courseName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: true },
    field: 'course_name'
  },
  courseSlug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
    field: 'course_slug'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryMode: {
    type: DataTypes.ENUM('online', 'offline', 'hybrid'),
    defaultValue: 'online',
    field: 'delivery_mode'
  },
  courseType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'course_type'
  },
  courseStatus: {
    type: DataTypes.ENUM('draft', 'active', 'archived'),
    defaultValue: 'draft',
    field: 'course_status'
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'selling_price'
  },
  discountedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'discounted_price'
  },
  gstPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 18.00,
    field: 'gst_percentage'
  },
  feePlan: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'fee_plan'
  },
  language: {
    type: DataTypes.STRING(50),
    defaultValue: 'English'
  },
  showOnHomepage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'show_on_homepage'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'created_by'
  }
}, {
  tableName: 'courses',
  underscored: true,
  timestamps: true
});

module.exports = Course;
