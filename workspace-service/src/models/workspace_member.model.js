import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const WorkspaceMember = sequelize.define(
  "WorkspaceMember",
  {
    workspace_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    workspace_role: {
      type: DataTypes.ENUM("Owner", "Admin", "Member", "Viewer"),
      defaultValue: "Member"
    }
  },
  {
    tableName: "workspace_members",
    timestamps: true,
    createdAt: "joined_at",
    updatedAt: false
  }
);
