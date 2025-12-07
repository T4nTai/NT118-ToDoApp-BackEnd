import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PerformanceRecord = sequelize.define(
  "PerformanceRecord",
  {
    performance_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    project_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    score: DataTypes.DECIMAL(5,2),
    comment: DataTypes.TEXT
  },
  {
    tableName: "performance_record",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
