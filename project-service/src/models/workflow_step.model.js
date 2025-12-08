import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const WorkflowStep = sequelize.define(
  "WorkflowStep",
  {
    step_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workflow_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    step_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "workflow_steps",
    timestamps: false,
  }
);
