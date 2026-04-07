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
    attendanceDayId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'attendance_day_id'
    },
    punchInAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'punch_in_at'
    },
    punchOutAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'punch_out_at'
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'duration_seconds'
    },
    breakStartedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'break_started_at'
    },
    totalBreakSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_break_seconds'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Remote',
      field: 'location_name'
    },
    summaryText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'summary_text'
    }
  },
  {
    tableName: 'attendance_sessions',
    underscored: true,
    timestamps: true
  }
);

AttendanceSession.associate = (models) => {
  AttendanceSession.belongsTo(models.AttendanceDay, {
    foreignKey: 'attendanceDayId'
  });
};

module.exports = AttendanceSession;
