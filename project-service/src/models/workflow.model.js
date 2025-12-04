import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Workflow = sequelize.define(
  "Workflow",
  {
    workflow_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    project_id: DataTypes.INTEGER,
    name: DataTypes.STRING(100),
    description: DataTypes.TEXT
  },
  {
    tableName: "workflows",
    timestamps: false
  }
);
