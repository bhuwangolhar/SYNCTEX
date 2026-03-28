const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Enquiry = sequelize.define("Enquiry", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  message: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("NEW","CONTACTED","CLOSED"),
    defaultValue: "NEW"
  }
},{
  tableName: "enquiries"
});

module.exports = Enquiry;