'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AttendanceDay = sequelize.define(
  'AttendanceDay',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organization_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalWorkedSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_worked_seconds'
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED', 'AUTO_CLOSED'),
      allowNull: false,
      defaultValue: 'OPEN'
    },
    autoClosedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'auto_closed_at'
    },

    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt'
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt'
    }
  },
  {
    tableName: 'attendance_days',
    underscored: true,
    timestamps: true
  }
);

AttendanceDay.associate = (models) => {
  AttendanceDay.hasMany(models.AttendanceSession, {
    foreignKey: 'attendanceDayId'
  });
};

module.exports = AttendanceDay;
