// src/models/task_history.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TaskHistory = sequelize.define(
  "TaskHistory",
  {
    history_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changed_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    old_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "task_history",
    timestamps: false,
    indexes: [
      { fields: ["task_id"] },
      { fields: ["changed_by_user_id"] },
    ],
  }
);
