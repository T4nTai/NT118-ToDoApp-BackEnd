import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Notification = sequelize.define("Notification", {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(
      "task_assigned",
      "task_updated",
      "task_status_changed",
      "task_comment",
      "task_due_soon",
      "task_overdue",
      "project_assigned",
      "project_updated",
      "project_completed",
      "project_due_soon",
      "workspace_invite",
      "group_invite",
      "performance_review",
      "system"
    ),
    allowNull: false
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  context_type: {
    type: DataTypes.ENUM(
      "task",
      "project",
      "workspace",
      "group",
      "performance",
      "system"
    ),
    allowNull: true
  },

  context_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  is_seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "notifications",
  timestamps: false
});
