'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    if (!table.mobile) {
      await queryInterface.addColumn('users', 'mobile', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('users');

    if (table.mobile) {
      await queryInterface.removeColumn('users', 'mobile');
    }
  }
};
