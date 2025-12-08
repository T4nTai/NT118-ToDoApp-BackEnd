// src/models/file.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const File = sequelize.define(
  "File",
  {
    file_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    owner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("cloudinary", "local", "s3"),
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    resource_type: {
      type: DataTypes.ENUM("image", "file", "video", "other"),
      allowNull: false,
      defaultValue: "image",
    },
    context_type: {
      type: DataTypes.ENUM("avatar", "attachment", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    context_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "files",
    timestamps: false,
    indexes: [
      { fields: ["owner_user_id"] },
      { fields: ["context_type", "context_id"] },
    ],
  }
);
