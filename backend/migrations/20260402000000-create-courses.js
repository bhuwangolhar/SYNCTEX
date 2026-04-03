'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create courses table with all fields for course management
    await queryInterface.createTable('courses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      course_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      course_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      course_slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      delivery_mode: {
        type: Sequelize.ENUM('online', 'offline', 'hybrid'),
        defaultValue: 'online'
      },
      course_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      course_status: {
        type: Sequelize.ENUM('draft', 'active', 'archived'),
        defaultValue: 'draft'
      },
      selling_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      discounted_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      gst_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 18.00
      },
      fee_plan: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      language: {
        type: Sequelize.STRING(50),
        defaultValue: 'English'
      },
      show_on_homepage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.UUID,
        allownull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add index for faster course lookups by org and status
    await queryInterface.addIndex('courses', ['organization_id', 'course_status']);
    await queryInterface.addIndex('courses', ['organization_id', 'course_code']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop courses table on rollback
    await queryInterface.dropTable('courses');
  }
};
