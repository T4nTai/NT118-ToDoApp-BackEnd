import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/project_member.model.js";
import { ProjectGroup } from "../models/project_group.model.js";
import { Workflow } from "../models/workflow.model.js";
import { WorkflowStep } from "../models/workflow_step.model.js";

import { checkUserExists } from "../helper/auth.helper.js";
import { checkWorkspaceExists } from "../helper/workspace.helper.js";
import { checkGroupExists, getGroupMembers } from "../helper/group.helper.js";

import {
  checkProjectExists,
  checkProjectMember,
  canManageMembers
} from "../helper/project.helper.js";

export class ProjectService {

  static async createProject(data) {
    const { 
      workspace_id,
      name,
      description,
      status,
      priority,
      start_date,
      due_date,
      owner_id
    } = data;

    if (!name || !workspace_id || !owner_id)
      throw { status: 400, message: "Missing name, workspace_id or owner_id" };

    await checkWorkspaceExists(workspace_id);
    await checkUserExists(owner_id);

    if (start_date && due_date && new Date(start_date) > new Date(due_date))
      throw { status: 400, message: "Ngày bắt đầu không thể sau ngày kết thúc" };

    const project = await Project.create({
      workspace_id,
      name,
      description,
      status,
      priority,
      start_date,
      due_date,
      owner_id
    });

    await ProjectMember.create({
      project_id: project.project_id,
      user_id: owner_id,
      role: "Owner"
    });

    const workflow = await Workflow.create({
      project_id: project.project_id,
      name: `${name} Workflow`
    });

    const steps = [
      { name: "To Do", step_order: 1 },
      { name: "In Progress", step_order: 2 },
      { name: "Review", step_order: 3 },
      { name: "Done", step_order: 4 }
    ];

    for (const s of steps) {
      await WorkflowStep.create({
        workflow_id: workflow.workflow_id,
        name: s.name,
        step_order: s.step_order
      });
    }

    return project;
  }

  static async getProjectDetail(project_id) {
    return await checkProjectExists(project_id);
  }

  static async updateProject(project_id, requester_id, updates) {

    await checkProjectExists(project_id);
    const requester = await checkProjectMember(project_id, requester_id);

    if (!canManageMembers(requester.role))
      throw { status: 403, message: "Not allowed to update project" };

    await Project.update(updates, { where: { project_id } });

    return await Project.findByPk(project_id);
  }

  static async deleteProject({ project_id, requester_id }) {

    const requester = await checkProjectMember(project_id, requester_id);

    if (requester.role !== "Owner")
      throw { status: 403, message: "Only Owner can delete project" };

    await Project.destroy({ where: { project_id } });

    return true;
  }

  static async addMember({ project_id, target_user_id, role, requester_id }) {

    await checkProjectExists(project_id);
    const requester = await checkProjectMember(project_id, requester_id);

    if (!canManageMembers(requester.role))
      throw { status: 403, message: "Not allowed to add members" };

    await checkUserExists(target_user_id);

    const exists = await ProjectMember.findOne({
      where: { project_id, user_id: target_user_id }
    });

    if (exists)
      throw { status: 400, message: "User already in project" };

    return await ProjectMember.create({
      project_id,
      user_id: target_user_id,
      role: role || "Contributor"
    });
  }

  static async removeMember({ project_id, target_user_id, requester_id }) {

    const requester = await checkProjectMember(project_id, requester_id);

    if (requester.role !== "Owner")
      throw { status: 403, message: "Only Owner can remove member" };

    if (requester.user_id === Number(target_user_id))
      throw { status: 400, message: "Owner cannot remove themselves" };

    await ProjectMember.destroy({
      where: { project_id, user_id: target_user_id }
    });

    return true;
  }

  static async assignGroup({ project_id, group_id, requester_id, role = "Member" }) {

  const project = await checkProjectExists(project_id);
  const requester = await checkProjectMember(project_id, requester_id);

  if (!canManageMembers(requester.role))
    throw { status: 403, message: "Not allowed to assign group" };

  project.assigned_group_id = group_id;
  project.assigned_user_id = null;
  await project.save();

  const members = await getGroupMembers(group_id);

  for (const m of members) {
    const exists = await ProjectMember.findOne({
      where: { project_id, user_id: m.user_id }
    });

    if (!exists) {
      await ProjectMember.create({
        project_id,
        user_id: m.user_id,
        role
      });
    } else if (exists.role !== role) {
      exists.role = role;
      await exists.save();
    }
  }

  return project;
}


  static async assignToUser({ project_id, target_user_id, requester_id, role = "Member" }) {

  const project = await checkProjectExists(project_id);
  const requester = await checkProjectMember(project_id, requester_id);

  if (!canManageMembers(requester.role))
    throw { status: 403, message: "Not allowed to assign user" };

  await checkUserExists(target_user_id);
  project.assigned_user_id = target_user_id;
  project.assigned_group_id = null;
  await project.save();
  const exists = await ProjectMember.findOne({
    where: { project_id, user_id: target_user_id }
  });

  if (!exists) {
    await ProjectMember.create({
      project_id,
      user_id: target_user_id,
      role
    });
  }

  return project;
}
}
