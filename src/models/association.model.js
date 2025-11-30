import { User } from './auth.model.js';
import { Group } from './group.model.js';
import { GroupMember } from './group_member.model.js';
import { RefreshToken } from './token.model.js';
import { Task } from './task.model.js';
import { Project } from './project.model.js';
import { ProjectMember } from './project_member.model.js';
import { PerformanceRecord } from './performance_record.model.js';
import { Subtask } from './subtask.model.js';
import { Workspace } from './workspace.model.js';
import { WorkspaceMember } from './workspace_member.model.js';
import { TaskHistory } from './task_history.model.js';
import { Milestone } from './milestone.model.js';
import { Workflow } from './workflow.model.js';
import { WorkflowStep } from './workflow_step.model.js';
import { Comment } from './comment.model.js';
import { CommentHistory } from './comment_history.model.js';
import { WorkspaceInvitation, GroupInvitation, ProjectInvitation } from './invitation.model.js';


export default function initAssociations() {

  // ------------------------------------------
  // Workspace ↔ Owner
  // ------------------------------------------
  Workspace.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
  User.hasMany(Workspace, { foreignKey: 'owner_id', as: 'ownedWorkspaces' });

  // ------------------------------------------
  // Workspace Members (N-N)
  // ------------------------------------------
  Workspace.hasMany(WorkspaceMember, { foreignKey: 'workspace_id', as: 'members' });
  WorkspaceMember.belongsTo(Workspace, { foreignKey: 'workspace_id', as: 'workspace' });

  User.hasMany(WorkspaceMember, { foreignKey: 'user_id', as: 'workspaceMemberships' });
  WorkspaceMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Workspace.belongsToMany(User, {
    through: WorkspaceMember,
    foreignKey: 'workspace_id',
    otherKey: 'user_id',
    as: 'users'
  });
  User.belongsToMany(Workspace, {
    through: WorkspaceMember,
    foreignKey: 'user_id',
    otherKey: 'workspace_id',
    as: 'workspaces'
  });

  // ------------------------------------------
  // Groups ↔ Workspace
  // ------------------------------------------
  Group.belongsTo(Workspace, { foreignKey: 'workspace_id', as: 'workspace' });
  Workspace.hasMany(Group, { foreignKey: 'workspace_id', as: 'groups' });

  // ------------------------------------------
  // Group Members (N-N)
  // ------------------------------------------
  Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'members' });
  GroupMember.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

  User.hasMany(GroupMember, { foreignKey: 'user_id', as: 'groupMemberships' });
  GroupMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Group.belongsToMany(User, {
    through: GroupMember,
    foreignKey: 'group_id',
    otherKey: 'user_id',
    as: 'users'
  });
  User.belongsToMany(Group, {
    through: GroupMember,
    foreignKey: 'user_id',
    otherKey: 'group_id',
    as: 'groups'
  });

  // ------------------------------------------
  // Workflow ↔ Group
  // ------------------------------------------
  Workflow.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
  Group.hasMany(Workflow, { foreignKey: 'group_id', as: 'workflows' });

  WorkflowStep.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });
  Workflow.hasMany(WorkflowStep, { foreignKey: 'workflow_id', as: 'steps' });

  // ------------------------------------------
  // Project ↔ Workspace
  // ------------------------------------------
  Project.belongsTo(Workspace, { foreignKey: 'workspace_id', as: 'workspace' });
  Workspace.hasMany(Project, { foreignKey: 'workspace_id', as: 'projects' });

  // ------------------------------------------
  // Project ↔ Owner
  // ------------------------------------------
  Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
  User.hasMany(Project, { foreignKey: 'owner_id', as: 'ownedProjects' });

  // ------------------------------------------
  // NEW: Project ↔ Assigned Group
  // ------------------------------------------
  Project.belongsTo(Group, { foreignKey: 'assigned_group_id', as: 'assignedGroup' });
  Group.hasMany(Project, { foreignKey: 'assigned_group_id', as: 'assignedProjects' });

  // ------------------------------------------
  // NEW: Project ↔ Assigned User
  // ------------------------------------------
  Project.belongsTo(User, { foreignKey: 'assigned_user_id', as: 'assignedUser' });
  User.hasMany(Project, { foreignKey: 'assigned_user_id', as: 'userAssignedProjects' });

  // ------------------------------------------
  // Project ↔ Workflow
  // ------------------------------------------
  Project.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });
  Workflow.hasMany(Project, { foreignKey: 'workflow_id', as: 'projects' });

  // ------------------------------------------
  // Project Members (N-N)
  // ------------------------------------------
  Project.hasMany(ProjectMember, { foreignKey: 'project_id', as: 'projectMembers' });
  ProjectMember.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

  User.hasMany(ProjectMember, { foreignKey: 'user_id', as: 'projectMemberships' });
  ProjectMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Project.belongsToMany(User, {
    through: ProjectMember,
    foreignKey: 'project_id',
    otherKey: 'user_id',
    as: 'members'
  });
  User.belongsToMany(Project, {
    through: ProjectMember,
    foreignKey: 'user_id',
    otherKey: 'project_id',
    as: 'memberProjects'
  });

  // ------------------------------------------
  // Milestones ↔ Project
  // ------------------------------------------
  Milestone.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
  Project.hasMany(Milestone, { foreignKey: 'project_id', as: 'milestones' });

  // ------------------------------------------
  // Tasks
  // ------------------------------------------
  Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });

  Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
  User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });

  // optional project
  Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
  Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });

  // optional group
  Task.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
  Group.hasMany(Task, { foreignKey: 'group_id', as: 'tasks' });

  Task.belongsTo(Milestone, { foreignKey: 'milestone_id', as: 'milestone' });
  Milestone.hasMany(Task, { foreignKey: 'milestone_id', as: 'tasks' });

  Task.belongsTo(WorkflowStep, { foreignKey: 'step_id', as: 'step' });
  WorkflowStep.hasMany(Task, { foreignKey: 'step_id', as: 'tasks' });

  // ------------------------------------------
  // Subtasks
  // ------------------------------------------
  Task.hasMany(Subtask, { foreignKey: 'task_id', as: 'subtasks' });
  Subtask.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  // ------------------------------------------
  // Task History
  // ------------------------------------------
  TaskHistory.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
  Task.hasMany(TaskHistory, { foreignKey: 'task_id', as: 'history' });

  TaskHistory.belongsTo(User, { foreignKey: 'changed_by_user_id', as: 'changedBy' });
  User.hasMany(TaskHistory, { foreignKey: 'changed_by_user_id', as: 'taskHistoryChanges' });

  // ------------------------------------------
  // Comments
  // ------------------------------------------
  Comment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
  Task.hasMany(Comment, { foreignKey: 'task_id', as: 'comments' });

  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });

  CommentHistory.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });
  Comment.hasMany(CommentHistory, { foreignKey: 'comment_id', as: 'history' });

  CommentHistory.belongsTo(User, { foreignKey: 'edited_by_user_id', as: 'editor' });
  User.hasMany(CommentHistory, { foreignKey: 'edited_by_user_id', as: 'editedComments' });

  // ------------------------------------------
  // Refresh Tokens
  // ------------------------------------------
  RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });

  // ------------------------------------------
  // Performance Records
  // ------------------------------------------
  PerformanceRecord.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
  Group.hasMany(PerformanceRecord, { foreignKey: 'group_id', as: 'performanceRecords' });

  PerformanceRecord.belongsTo(User, { foreignKey: 'user_id', as: 'member' });
  User.hasMany(PerformanceRecord, { foreignKey: 'user_id', as: 'receivedEvaluations' });

  PerformanceRecord.belongsTo(User, { foreignKey: 'created_by', as: 'evaluator' });
  User.hasMany(PerformanceRecord, { foreignKey: 'created_by', as: 'givenEvaluations' });

  // ------------------------------------------
  // Invitations
  // ------------------------------------------
  WorkspaceInvitation.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });
  Workspace.hasMany(WorkspaceInvitation, { foreignKey: "workspace_id", as: "invitations" });

  WorkspaceInvitation.belongsTo(User, { foreignKey: "invited_by", as: "inviter" });
  User.hasMany(WorkspaceInvitation, { foreignKey: "invited_by", as: "sentWorkspaceInvitations" });

  GroupInvitation.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  Group.hasMany(GroupInvitation, { foreignKey: "group_id", as: "invitations" });

  GroupInvitation.belongsTo(User, { foreignKey: "invited_by", as: "inviter" });
  User.hasMany(GroupInvitation, { foreignKey: "invited_by", as: "sentGroupInvitations" });

  ProjectInvitation.belongsTo(Project, { foreignKey: "project_id", as: "project" });
  Project.hasMany(ProjectInvitation, { foreignKey: "project_id", as: "invitations" });

  ProjectInvitation.belongsTo(User, { foreignKey: "invited_by", as: "inviter" });
  User.hasMany(ProjectInvitation, { foreignKey: "invited_by", as: "sentProjectInvitations" });
}
