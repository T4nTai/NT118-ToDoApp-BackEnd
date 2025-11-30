import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Subtask = sequelize.define('Subtask', {
  subtask_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'task_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  priority: {
  type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
  allowNull: false,
  defaultValue: 'Medium'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Review', 'Done', 'Blocked'),
    allowNull: false,
    defaultValue: 'To Do'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'subtasks',
  timestamps: false,
  indexes: [
    { fields: ['task_id'] }
  ]
});
