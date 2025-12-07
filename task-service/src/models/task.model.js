import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Task = sequelize.define(
  "Task",
  {
    task_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    project_id: DataTypes.INTEGER,
    milestone_id: DataTypes.INTEGER,
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    priority: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
    task_progress: DataTypes.DECIMAL(5,2),
    created_by: DataTypes.INTEGER,
    assigned_to: DataTypes.INTEGER,
    status: DataTypes.ENUM("To Do", "In Progress", "Done"),
    step_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    due_date: DataTypes.DATE
  },
  {
    tableName: "tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);
