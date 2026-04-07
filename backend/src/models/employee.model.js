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
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organization_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id'
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'employee_id'
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name'
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
    dateOfJoining: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_joining'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by'
    }
  },
  {
    tableName: 'employees',
    underscored: true,
    timestamps: true
  }
);

Employee.associate = (models) => {
  if (models.User) {
    Employee.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Employee.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  }
};

module.exports = Employee;

