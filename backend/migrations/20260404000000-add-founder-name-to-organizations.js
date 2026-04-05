'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('organizations');
    
    if (!table.founder_name) {
      await queryInterface.addColumn('organizations', 'founder_name', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('organizations');
    
    if (table.founder_name) {
      await queryInterface.removeColumn('organizations', 'founder_name');
    }
  }
};
