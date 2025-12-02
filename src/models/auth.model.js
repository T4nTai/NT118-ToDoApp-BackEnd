import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const User = sequelize.define('User', {
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
  username: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  github_id: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  avatar_url: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  avatar_public_id: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  github_access_token: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reset_token: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  reset_expires: {
  type: DataTypes.DATE,
  allowNull: true,
  },
  }, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
  });
