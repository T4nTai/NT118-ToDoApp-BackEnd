// src/models/comment_history.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const CommentHistory = sequelize.define(
  "CommentHistory",
  {
    comment_history_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edited_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    old_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    edited_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "comments_history",
    timestamps: false,
    indexes: [
      { fields: ["comment_id"] },
      { fields: ["edited_by_user_id"] },
    ],
  }
);
