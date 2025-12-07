import { ProjectMember } from "../models/project_member.model.js";

export async function checkProjectMember(project_id, user_id) {
  const member = await ProjectMember.findOne({
    where: { project_id, user_id }
  });
    if (!member) { 
        throw { status: 403, message: "You are not a member of this project" };
    }
    return member;
}

export function canManageMembers(role) {
    return ["Owner", "Manager"].includes(role);
}
