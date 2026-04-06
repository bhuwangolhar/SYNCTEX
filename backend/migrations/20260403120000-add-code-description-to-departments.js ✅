'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('departments');
    
    if (!table.code) {
      await queryInterface.addColumn('departments', 'code', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false // per org, but since org_id, we can handle in model
      });
    }
    
    if (!table.description) {
      await queryInterface.addColumn('departments', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('departments');
    
    if (table.code) {
      await queryInterface.removeColumn('departments', 'code');
    }
    
    if (table.description) {
      await queryInterface.removeColumn('departments', 'description');
    }
  }
};
