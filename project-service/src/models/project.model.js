import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Project = sequelize.define(
  "Project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    workspace_id: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("Active", "On Hold", "Completed", "Archived"),
      defaultValue: "Active"
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
      defaultValue: "Medium"
    },
    owner_id: DataTypes.INTEGER,
    assigned_group_id: DataTypes.INTEGER,
    assigned_user_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    due_date: DataTypes.DATE
  },
  {
    tableName: "projects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
