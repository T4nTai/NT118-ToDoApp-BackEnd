import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Milestone = sequelize.define(
  "Milestone",
  {
    milestone_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    project_id: DataTypes.INTEGER,
    name: DataTypes.STRING(100),
    description: DataTypes.TEXT,
    due_date: DataTypes.DATE,
    is_completed: DataTypes.BOOLEAN,
    completed_at: DataTypes.DATE
  },
  {
    tableName: "milestones",
    timestamps: false
  }
);
