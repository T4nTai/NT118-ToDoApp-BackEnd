import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TaskHistory = sequelize.define(
  "TaskHistory",
  {
    history_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    task_id: DataTypes.INTEGER,
    changed_by_user_id: DataTypes.INTEGER,
    field_name: DataTypes.STRING(50),
    old_value: DataTypes.TEXT,
    new_value: DataTypes.TEXT
  },
  {
    tableName: "task_history",
    timestamps: true,
    createdAt: "changed_at",
    updatedAt: false
  }
);
