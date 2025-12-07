import sequelize from "../config/db.js";
import { Project } from "./project.model.js";
import { ProjectMember } from "./project_member.model.js";
import { ProjectGroup } from "./project_groups.model.js";
import { Milestone } from "./milestone.model.js";
import { Workflow } from "./workflow.model.js";
import { WorkflowStep } from "./workflow_step.model.js";
import { PerformanceRecord } from "./performance_record.model.js";

export default function initAssociations() {
    Project.hasMany(ProjectMember, {
  foreignKey: "project_id",
  as: "members"
});
ProjectMember.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

// Project -> Project Groups (1 - N)
Project.hasMany(ProjectGroup, {
  foreignKey: "project_id",
  as: "groups"
});
ProjectGroup.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

// Project -> Milestones (1 - N)
Project.hasMany(Milestone, {
  foreignKey: "project_id",
  as: "milestones"
});
Milestone.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

// Project -> Workflows (1 - N)
Project.hasMany(Workflow, {
  foreignKey: "project_id",
  as: "workflows"
});
Workflow.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

// Project -> Performance Records (1 - N)
Project.hasMany(PerformanceRecord, {
  foreignKey: "project_id",
  as: "performance"
});
PerformanceRecord.belongsTo(Project, {
  foreignKey: "project_id",
  as: "project"
});

// ===============================
//  WORKFLOW RELATIONS
// ===============================

// Workflow -> Workflow Steps (1 - N)
Workflow.hasMany(WorkflowStep, {
  foreignKey: "workflow_id",
  as: "steps"
});
WorkflowStep.belongsTo(Workflow, {
  foreignKey: "workflow_id",
  as: "workflow"
});
}