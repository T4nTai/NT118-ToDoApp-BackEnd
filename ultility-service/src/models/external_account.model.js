// src/models/external_account.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ExternalAccount = sequelize.define(
  "ExternalAccount",
  {
    external_account_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // ID từ auth-service
    },
    provider: {
      type: DataTypes.ENUM("github", "google", "gmail"),
      allowNull: false,
    },
    external_user_id: {
      type: DataTypes.STRING(255),
      allowNull: true, // github_id / google_sub
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    scopes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "external_accounts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id", "provider"] },
    ],
  }
);
