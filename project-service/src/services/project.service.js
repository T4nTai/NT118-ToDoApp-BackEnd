import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/project_member.model.js";
import { ProjectGroup } from "../models/project_group.model.js";
import { validateUserExists } from "../helper/validateUser.js";
import { checkProjectExists } from "../helper/checkProject.js";
import { checkProjectMember, canManageMembers } from "../helper/checkMember.js";
import { Workflow } from "../models/workflow.model.js";
import { WorkflowStep } from "../models/workflow_step.model.js";

export class ProjectService {

  static async createProject(data) {
    const {
      name, workspace_id, description, status, priority,
      assigned_group_id, assigned_user_id, start_date, due_date, owner_id
    } = data;

    if (!name || !workspace_id || !owner_id)
      throw { status: 400, message: "Missing name, workspace_id or owner_id" };

    const project = await Project.create({
      name, workspace_id, description, status, priority,
      owner_id, assigned_group_id, assigned_user_id, start_date, due_date
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

  static async updateProject({ project_id, requester_id, ...update }) {
    const project = await checkProjectExists(project_id);
    const requester = await checkProjectMember(project_id, requester_id);

    if (!canManageMembers(requester.role))
      throw { status: 403, message: "Not allowed to update project" };

    await Project.update(update, { where: { project_id } });

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

    await validateUserExists(target_user_id);

    const exists = await ProjectMember.findOne({
      where: { project_id, user_id: target_user_id }
    });
    if (exists) throw { status: 400, message: "User already in project" };

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

  static async addGroup({ project_id, group_id, requester_id }) {
    const requester = await checkProjectMember(project_id, requester_id);
    if (!canManageMembers(requester.role))
      throw { status: 403, message: "Not allowed to assign group" };

    const exists = await ProjectGroup.findOne({ where: { project_id, group_id } });
    if (exists) throw { status: 400, message: "Group already assigned" };

    await ProjectGroup.create({ project_id, group_id });
    await Project.update(
      { assigned_group_id: group_id },
      { where: { project_id } }
    );

    return true;
  }

  static async assignToUser({ project_id, target_user_id, requester_id }) {
    const requester = await checkProjectMember(project_id, requester_id);

    if (!canManageMembers(requester.role))
      throw { status: 403, message: "Not allowed to assign user" };

    await validateUserExists(target_user_id);

    await Project.update(
      { assigned_user_id: target_user_id },
      { where: { project_id } }
    );

    return true;
  }
}
