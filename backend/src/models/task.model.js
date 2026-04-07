// task model

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Task = sequelize.define(
  "Task",
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
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'assigned_to'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM("TODO", "IN_PROGRESS", "DONE"),
      defaultValue: "TODO"
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM"
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      field: 'due_date'
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
    tableName: "tasks",
    underscored: true,
    timestamps: true
  }
);

module.exports = Task;