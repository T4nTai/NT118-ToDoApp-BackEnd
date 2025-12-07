import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/project_member.model.js";

export async function checkProjectExists(project_id) {
  const project = await Project.findByPk(project_id);
  if (!project) {
    throw { status: 404, message: "Project không tồn tại" };
  }
  return project;
}

export async function checkProjectMember(project_id, user_id) {
  const member = await ProjectMember.findOne({
    where: { project_id, user_id }
  });
  if (!member) {
    throw { status: 403, message: "Bạn không phải thành viên project" };
  }
  return member;
}

export function canManageMembers(role) {
  return role === "Owner" || role === "Admin";
}
