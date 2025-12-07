import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Milestone = sequelize.define("Milestone", {
  milestone_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.TEXT,
  start_date: DataTypes.DATE,
  due_date: DataTypes.DATE,
  is_completed: { type: DataTypes.TINYINT, defaultValue: 0 },
  completed_at: DataTypes.DATE
}, {
  tableName: "milestones",
  timestamps: false
});