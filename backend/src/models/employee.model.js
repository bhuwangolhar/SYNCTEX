'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Employee = sequelize.define(
  'Employee',
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
      allowNull: true
    },
    employee_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
      defaultValue: 'active'
    },
    date_of_joining: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    tableName: 'employees',
    underscored: true
  }
);

Employee.associate = (models) => {
  if (models.User) {
    Employee.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Employee.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  }
};

module.exports = Employee;

