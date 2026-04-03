'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_days', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      total_worked_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'CLOSED', 'AUTO_CLOSED'),
        allowNull: false,
        defaultValue: 'OPEN'
      },
      auto_closed_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addConstraint('attendance_days', {
      fields: ['organization_id', 'user_id', 'date'],
      type: 'unique',
      name: 'attendance_days_unique_per_org_user_date'
    });

    await queryInterface.createTable('attendance_sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      attendance_day_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'attendance_days', key: 'id' },
        onDelete: 'CASCADE'
      },
      punch_in_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      punch_out_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      duration_seconds: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      break_started_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      total_break_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Remote'
      },
      summary_text: {
        type: Sequelize.TEXT,
        allowNull: true
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendance_sessions');
    await queryInterface.dropTable('attendance_days');
  }
};
