'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      assigned_to: {
        type: Sequelize.UUID
      },
      created_by: {
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      status: {
        type: Sequelize.ENUM('TODO','IN_PROGRESS','DONE'),
        defaultValue: 'TODO'
      },
      priority: {
        type: Sequelize.ENUM('LOW','MEDIUM','HIGH'),
        defaultValue: 'MEDIUM'
      },
      due_date: Sequelize.DATEONLY,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tasks');
  }
};