'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('organizations');
    
    if (!table.contact_info) {
      await queryInterface.addColumn('organizations', 'contact_info', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('organizations');
    
    if (table.contact_info) {
      await queryInterface.removeColumn('organizations', 'contact_info');
    }
  }
};
