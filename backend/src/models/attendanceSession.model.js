'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AttendanceSession = sequelize.define(
  'AttendanceSession',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    attendance_day_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    punch_in_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    punch_out_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    break_started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_break_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Remote'
    },
    summary_text: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'attendance_sessions'
  }
);

AttendanceSession.associate = (models) => {
  AttendanceSession.belongsTo(models.AttendanceDay, {
    foreignKey: 'attendance_day_id'
  });
};

module.exports = AttendanceSession;
