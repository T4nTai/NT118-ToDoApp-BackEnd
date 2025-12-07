import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const GroupMember = sequelize.define(
  "GroupMember",
  {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    role: {
      type: DataTypes.ENUM("Owner", "Manager", "Member", "Viewer"),
      defaultValue: "Member"
    }
  },
  {
    tableName: "group_members",
    timestamps: true,
    createdAt: "joined_at",
    updatedAt: false
  }
);
