import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    username: DataTypes.STRING(50),
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_number: DataTypes.STRING(20),
    address: DataTypes.STRING(100),
    birthday: DataTypes.DATE,
    gender: DataTypes.ENUM("Male", "Female", "Other"),
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User"
    },
    reset_token: DataTypes.STRING(10),
    reset_expires: DataTypes.DATE
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);
