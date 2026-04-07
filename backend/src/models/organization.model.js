// org model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    founderName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'founder_name'
    },
    contactInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      field: 'contact_info'
    },
    taxInfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      field: 'tax_info'
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
    tableName: "organizations",
    underscored: true,
    timestamps: true
  }
);

module.exports = Organization;