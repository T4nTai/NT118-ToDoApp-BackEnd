import { Project } from "./project.model.js";
import { ProjectMember } from "./project_member.model.js";
import { ProjectGroup } from "./project_group.model.js";
import { Milestone } from "./milestone.model.js";
import { Workflow } from "./workflow.model.js";
import { WorkflowStep } from "./workflow_step.model.js";
import { PerformanceRecord } from "./performance_record.model.js";

export default function initModels() {
  Project.hasMany(ProjectMember, {
    foreignKey: "project_id",
    as: "members",
  });
  ProjectMember.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });

  Project.hasMany(ProjectGroup, {
    foreignKey: "project_id",
    as: "groups",
  });
  ProjectGroup.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });

  Project.hasMany(Milestone, {
    foreignKey: "project_id",
    as: "milestones",
  });
  Milestone.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });

  Project.hasMany(Workflow, {
    foreignKey: "project_id",
    as: "workflows",
  });
  Workflow.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });

  Workflow.hasMany(WorkflowStep, {
    foreignKey: "workflow_id",
    as: "steps",
  });
  WorkflowStep.belongsTo(Workflow, {
    foreignKey: "workflow_id",
    as: "workflow",
  });

  Project.hasMany(PerformanceRecord, {
    foreignKey: "project_id",
    as: "performances",
  });
  PerformanceRecord.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
  });

  return {
    Project,
    ProjectMember,
    ProjectGroup,
    Milestone,
    Workflow,
    WorkflowStep,
    PerformanceRecord,
  };
}

export {
  Project,
  ProjectMember,
  ProjectGroup,
  Milestone,
  Workflow,
  WorkflowStep,
  PerformanceRecord,
};
