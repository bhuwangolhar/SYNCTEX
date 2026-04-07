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
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organization_id'
    },
    branchCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      field: 'branch_code'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branchType: {
      type: DataTypes.ENUM('HEAD_OFFICE', 'BRANCH_OFFICE', 'WAREHOUSE', 'RETAIL_OUTLET'),
      allowNull: false,
      defaultValue: 'BRANCH_OFFICE',
      field: 'branch_type'
    },
    branchStatus: {
      type: DataTypes.ENUM('ACTIVE', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      field: 'branch_status'
    },
    openingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'opening_date'
    },
    operationalSince: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'operational_since'
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'address_line1'
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'address_line2'
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
    googleMapsLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'google_maps_link'
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
    branchOwnerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'branch_owner_id'
    },
    gstRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'gst_registered'
    },
    gstinNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'gstin_number'
    },
    placeOfSupply: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'place_of_supply'
    },
    stateCode: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'state_code'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by'
    }
  },
  {
    tableName: 'branches',
    underscored: true,
    timestamps: true
  }
);

Branch.associate = (models) => {
  if (models.User) {
    Branch.belongsTo(models.User, { foreignKey: 'branchOwnerId', as: 'owner' });
    Branch.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  }
};

module.exports = Branch;
