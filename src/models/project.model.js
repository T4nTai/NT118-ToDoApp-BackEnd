import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  workspace_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assigned_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },

  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Completed'),
    allowNull: false,
    defaultValue: 'To Do'
  },

  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: false,
    defaultValue: 'Medium'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  attachment_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachment_public_id: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  tableName: 'projects',
  timestamps: false,
  indexes: [
    { fields: ['workspace_id'] },
    { fields: ['assigned_group_id'] },
    { fields: ['assigned_user_id'] },
    { fields: ['owner_id'] },
    { fields: ['workflow_id'] }
  ]
});
