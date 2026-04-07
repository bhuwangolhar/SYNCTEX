// user model

'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define(
  'User',
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

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },

    role: {
      type: DataTypes.ENUM('ADMIN', 'EMPLOYEE'),
      defaultValue: 'EMPLOYEE'
    }
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true
  }
);

module.exports = User;