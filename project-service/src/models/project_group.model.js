import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectGroup = sequelize.define(
  "ProjectGroup",
  {
    project_id: { type: DataTypes.INTEGER, primaryKey: true },
    group_id: { type: DataTypes.INTEGER, primaryKey: true }
  },
  {
    tableName: "project_groups",
    timestamps: false
  }
);
