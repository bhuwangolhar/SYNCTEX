'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },

      organization_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      email: Sequelize.STRING,
      phone: Sequelize.STRING,

      message: Sequelize.TEXT,

      status: {
        type: Sequelize.ENUM('NEW','CONTACTED','CLOSED'),
        defaultValue: 'NEW'
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  }
};