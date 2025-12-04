import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const CommentHistory = sequelize.define(
  "CommentHistory",
  {
    comment_history_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    comment_id: DataTypes.INTEGER,
    edited_by_user_id: DataTypes.INTEGER,
    old_content: DataTypes.TEXT
  },
  {
    tableName: "comments_history",
    timestamps: true,
    createdAt: "edited_at",
    updatedAt: false
  }
);
