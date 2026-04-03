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
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_worked_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED', 'AUTO_CLOSED'),
      allowNull: false,
      defaultValue: 'OPEN'
    },
    auto_closed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'attendance_days'
  }
);

AttendanceDay.associate = (models) => {
  AttendanceDay.hasMany(models.AttendanceSession, {
    foreignKey: 'attendance_day_id'
  });
};

module.exports = AttendanceDay;
