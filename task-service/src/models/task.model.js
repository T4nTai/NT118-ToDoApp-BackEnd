// src/models/task.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Task = sequelize.define(
  "Task",
  {
    task_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
      allowNull: false,
      defaultValue: "Medium",
    },

    task_progress: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("To Do", "In Progress", "Done"),
      allowNull: true,
    },

    step_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["project_id"] },
      { fields: ["milestone_id"] },
      { fields: ["created_by"] },
      { fields: ["assigned_to"] },
      { fields: ["step_id"] },
      { fields: ["status"] },
    ],
  }
);
