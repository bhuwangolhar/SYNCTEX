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
    founder_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_info: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    tax_info: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  },
  {
    tableName: "organizations"
  }
);

module.exports = Organization;