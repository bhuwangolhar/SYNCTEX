'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('organizations');
    
    if (!table.tax_info) {
      await queryInterface.addColumn('organizations', 'tax_info', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('organizations');
    
    if (table.tax_info) {
      await queryInterface.removeColumn('organizations', 'tax_info');
    }
  }
};
