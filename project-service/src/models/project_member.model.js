import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    project_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    role: {
      type: DataTypes.ENUM("Owner", "Manager", "Contributor", "Viewer"),
      defaultValue: "Contributor"
    }
  },
  {
    tableName: "project_members",
    timestamps: true,
    createdAt: "joined_at",
    updatedAt: false
  }
);
