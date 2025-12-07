import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Comment = sequelize.define(
  "Comment",
  {
    comment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    task_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);
