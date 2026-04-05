'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('roles');
    
    if (!table.code) {
      await queryInterface.addColumn('roles', 'code', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      });
    }
    
    if (!table.description) {
      await queryInterface.addColumn('roles', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('roles');
    
    if (table.code) {
      await queryInterface.removeColumn('roles', 'code');
    }
    
    if (table.description) {
      await queryInterface.removeColumn('roles', 'description');
    }
  }
};
