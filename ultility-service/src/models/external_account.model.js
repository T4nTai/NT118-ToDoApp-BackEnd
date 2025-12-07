import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const File = sequelize.define(
  "File",
  {
    file_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    owner_user_id: DataTypes.INTEGER,
    provider: DataTypes.ENUM("cloudinary", "local", "s3"),
    public_id: DataTypes.STRING(255),
    url: DataTypes.STRING(512),
    resource_type: DataTypes.ENUM("image", "file", "video", "other"),
    context_type: DataTypes.ENUM("avatar", "attachment", "other"),
    context_id: DataTypes.INTEGER
  },
  {
    tableName: "files",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);
