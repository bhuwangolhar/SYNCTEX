'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Branch = sequelize.define(
  'Branch',
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
    branch_code: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branch_type: {
      type: DataTypes.ENUM('HEAD_OFFICE', 'BRANCH_OFFICE', 'WAREHOUSE', 'RETAIL_OUTLET'),
      allowNull: false,
      defaultValue: 'BRANCH_OFFICE'
    },
    branch_status: {
      type: DataTypes.ENUM('ACTIVE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    opening_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    operational_since: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    address_line1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address_line2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'India'
    },
    pincode: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    google_maps_link: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      validate: { min: -180, max: 180 }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    branch_owner_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    gst_registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    gstin_number: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    place_of_supply: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state_code: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    tableName: 'branches'
  }
);

Branch.associate = (models) => {
  if (models.User) {
    Branch.belongsTo(models.User, { foreignKey: 'branch_owner_id', as: 'owner' });
    Branch.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  }
};

module.exports = Branch;
