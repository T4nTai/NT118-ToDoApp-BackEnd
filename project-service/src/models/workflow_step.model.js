import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const WorkflowStep = sequelize.define(
  "WorkflowStep",
  {
    step_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workflow_id: DataTypes.INTEGER,
    name: DataTypes.STRING(100),
    step_order: DataTypes.INTEGER
  },
  {
    tableName: "workflow_steps",
    timestamps: false
  }
);
