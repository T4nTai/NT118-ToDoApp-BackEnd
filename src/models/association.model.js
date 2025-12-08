import { User } from "./auth.model.js";
import { Group } from "./group.model.js";
import { GroupMember } from "./group_member.model.js";
import { Workspace } from "./workspace.model.js";
import { WorkspaceMember } from "./workspace_member.model.js";
import { RefreshToken } from "./token.model.js";
import { Task } from "./task.model.js";
import { Project } from "./project.model.js";
import { ProjectMember } from "./project_member.model.js";
import { PerformanceRecord } from "./performance_record.model.js";
import { Subtask } from "./subtask.model.js";
import { TaskHistory } from "./task_history.model.js";
import { Milestone } from "./milestone.model.js";
import { Workflow } from "./workflow.model.js";
import { WorkflowStep } from "./workflow_step.model.js";
import { Comment } from "./comment.model.js";
import { CommentHistory } from "./comment_history.model.js";


export default function initAssociations() {

  // ======================================================
  // WORKSPACES → GROUPS / PROJECTS
  // ======================================================

  Workspace.hasMany(Group, { foreignKey: "workspace_id", as: "groups" });
  Group.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });

  Workspace.hasMany(Project, { foreignKey: "workspace_id", as: "projects" });
  Project.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });


  // ======================================================
  // WORKSPACE MEMBERS (Không có bảng Role riêng)
  // ======================================================

  Workspace.hasMany(WorkspaceMember, {
    foreignKey: "workspace_id",
    as: "members"
  });
  WorkspaceMember.belongsTo(Workspace, {
    foreignKey: "workspace_id",
    as: "workspace"
  });

  User.hasMany(WorkspaceMember, {
    foreignKey: "user_id",
    as: "workspaceMemberships"
  });
  WorkspaceMember.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
  });

  Workspace.belongsToMany(User, {
    through: WorkspaceMember,
    foreignKey: "workspace_id",
    otherKey: "user_id",
    as: "users"
  });

  User.belongsToMany(Workspace, {
    through: WorkspaceMember,
    foreignKey: "user_id",
    otherKey: "workspace_id",
    as: "workspaces"
  });


  // ======================================================
  // GROUPS – MEMBERS
  // ======================================================

  Group.hasMany(GroupMember, { foreignKey: "group_id", as: "groupMembers" });
  GroupMember.belongsTo(Group, { foreignKey: "group_id", as: "group" });

  User.hasMany(GroupMember, { foreignKey: "user_id", as: "groupMemberships" });
  GroupMember.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Group.belongsToMany(User, {
    through: GroupMember,
    foreignKey: "group_id",
    otherKey: "user_id",
    as: "users"
  });

  User.belongsToMany(Group, {
    through: GroupMember,
    foreignKey: "user_id",
    otherKey: "group_id",
    as: "groups"
  });


  // ======================================================
  // PROJECTS – RELATIONS
  // ======================================================

  // Owner
  Project.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
  User.hasMany(Project, { foreignKey: "owner_id", as: "ownedProjects" });

  // Assigned user
  Project.belongsTo(User, { foreignKey: "assigned_user_id", as: "assignedUser" });
  User.hasMany(Project, { foreignKey: "assigned_user_id", as: "assignedProjects" });

  // PROJECT <-> GROUP (Many-to-many)
  Project.belongsToMany(Group, {
    through: "project_groups",
    foreignKey: "project_id",
    otherKey: "group_id",
    as: "groups"
  });

  Group.belongsToMany(Project, {
    through: "project_groups",
    foreignKey: "group_id",
    otherKey: "project_id",
    as: "projects"
  });


  // PROJECT <-> USER (Many-to-many)
  Project.hasMany(ProjectMember, { foreignKey: "project_id", as: "projectMembers" });
  ProjectMember.belongsTo(Project, { foreignKey: "project_id", as: "project" });

  User.hasMany(ProjectMember, { foreignKey: "user_id", as: "projectMemberships" });
  ProjectMember.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Project.belongsToMany(User, {
    through: ProjectMember,
    foreignKey: "project_id",
    otherKey: "user_id",
    as: "members"
  });

  User.belongsToMany(Project, {
    through: ProjectMember,
    foreignKey: "user_id",
    otherKey: "project_id",
    as: "projectsJoined"
  });


  // ======================================================
  // MILESTONES
  // ======================================================

  Milestone.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Project.hasMany(Milestone, { foreignKey: "project_id", as: "milestones" });


  // ======================================================
  // WORKFLOWS
  // ======================================================

  Workflow.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Project.hasMany(Workflow, { foreignKey: "project_id", as: "workflows" });

  WorkflowStep.belongsTo(Workflow, { foreignKey: "workflow_id", as: "workflow" });
  Workflow.hasMany(WorkflowStep, { foreignKey: "workflow_id", as: "workflowSteps" });


  // ======================================================
  // TASKS
  // ======================================================

  Task.belongsTo(User, { foreignKey: "created_by", as: "creator" });
  User.hasMany(Task, { foreignKey: "created_by", as: "createdTasks" });

  Task.belongsTo(User, { foreignKey: "assigned_to", as: "assignee" });
  User.hasMany(Task, { foreignKey: "assigned_to", as: "assignedTasks" });

  Task.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Project.hasMany(Task, { foreignKey: "project_id", as: "tasks" });

  Task.belongsTo(Milestone, { foreignKey: "milestone_id", as: "milestone" });
  Milestone.hasMany(Task, { foreignKey: "milestone_id", as: "milestoneTasks" });

  Task.belongsTo(WorkflowStep, { foreignKey: "step_id", as: "step" });
  WorkflowStep.hasMany(Task, { foreignKey: "step_id", as: "tasks" });


  // ======================================================
  // SUBTASKS
  // ======================================================

  Task.hasMany(Subtask, { foreignKey: "task_id", as: "subtasks" });
  Subtask.belongsTo(Task, { foreignKey: "task_id", as: "task" });


  // ======================================================
  // TASK HISTORY
  // ======================================================

  Task.hasMany(TaskHistory, { foreignKey: "task_id", as: "history" });
  TaskHistory.belongsTo(Task, { foreignKey: "task_id", as: "task" });

  User.hasMany(TaskHistory, { foreignKey: "changed_by_user_id", as: "taskChanges" });
  TaskHistory.belongsTo(User, { foreignKey: "changed_by_user_id", as: "changedBy" });


  // ======================================================
  // COMMENTS
  // ======================================================

  Task.hasMany(Comment, { foreignKey: "task_id", as: "comments" });
  Comment.belongsTo(Task, { foreignKey: "task_id", as: "task" });

  User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
  Comment.belongsTo(User, { foreignKey: "user_id", as: "author" });

  Comment.hasMany(CommentHistory, { foreignKey: "comment_id", as: "history" });
  CommentHistory.belongsTo(Comment, { foreignKey: "comment_id", as: "comment" });

  User.hasMany(CommentHistory, { foreignKey: "edited_by_user_id", as: "commentEdits" });
  CommentHistory.belongsTo(User, { foreignKey: "edited_by_user_id", as: "editor" });


  // ======================================================
  // PERFORMANCE RECORDS
  // ======================================================

  PerformanceRecord.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  Group.hasMany(PerformanceRecord, { foreignKey: "group_id", as: "performanceRecords" });

  PerformanceRecord.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Project.hasMany(PerformanceRecord, { foreignKey: "project_id", as: "performanceRecords" });

  PerformanceRecord.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(PerformanceRecord, { foreignKey: "user_id", as: "performanceReceived" });

  PerformanceRecord.belongsTo(User, { foreignKey: "created_by", as: "createdBy" });
  User.hasMany(PerformanceRecord, { foreignKey: "created_by", as: "performanceGiven" });


  // ======================================================
  // REFRESH TOKEN
  // ======================================================

  RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });

  Project.belongsTo(Group, {
    foreignKey: "assigned_group_id",
    as: "assignedGroup"
  });
}
