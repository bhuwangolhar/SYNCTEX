'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'organizations', key: 'id' },
        onDelete: 'CASCADE'
      },
      branch_code: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      branch_type: {
        type: Sequelize.ENUM('HEAD_OFFICE', 'BRANCH_OFFICE', 'WAREHOUSE', 'RETAIL_OUTLET'),
        allowNull: false,
        defaultValue: 'BRANCH_OFFICE'
      },
      branch_status: {
        type: Sequelize.ENUM('ACTIVE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
      opening_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      operational_since: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      address_line1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address_line2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      area: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'India'
      },
      pincode: {
        type: Sequelize.STRING(6),
        allowNull: false
      },
      google_maps_link: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
        validate: { min: -90, max: 90 }
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
        validate: { min: -180, max: 180 }
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
      },
      branch_owner_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL'
      },
      gst_registered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      gstin_number: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      place_of_supply: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state_code: {
        type: Sequelize.STRING(2),
        allowNull: true
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('branches', ['organization_id']);
    await queryInterface.addIndex('branches', ['branch_code']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('branches');
  }
};
