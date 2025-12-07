import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Subtask = sequelize.define(
  "Subtask",
  {
    subtask_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    task_id: DataTypes.INTEGER,
    title: DataTypes.STRING(100),
    priority: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
    description: DataTypes.TEXT,
    status: DataTypes.ENUM("To Do", "In Progress", "Review", "Done", "Blocked")
  },
  {
    tableName: "subtasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
