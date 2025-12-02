import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Workspace = sequelize.define('Workspace', {
  workspace_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  workspace_token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'workspaces',
  timestamps: false,
  indexes: [
    { fields: ["workspace_token"] }
  ]
});
