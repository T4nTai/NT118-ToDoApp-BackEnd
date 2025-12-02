import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const ProjectGroup = sequelize.define("ProjectGroup", {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "projects",
      key: "project_id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  },
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "groups",
      key: "group_id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  }
}, {
  tableName: "project_groups",
  timestamps: false
});
