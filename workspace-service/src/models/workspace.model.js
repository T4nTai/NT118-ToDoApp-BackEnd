import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Workspace = sequelize.define(
  "Workspace",
  {
    workspace_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    workspace_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  
  {
    tableName: "workspaces",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
