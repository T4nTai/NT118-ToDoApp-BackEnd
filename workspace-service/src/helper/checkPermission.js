import { WorkspaceMember } from "../models/workspace_member.model.js";

export async function checkWorkspacePermission(workspace_id, user_id) {
  const member = await WorkspaceMember.findOne({
    where: { workspace_id, user_id }
  });

  if (!member)
    throw { status: 403, message: "You are not a member of this workspace" };

  if (!["Owner", "Admin"].includes(member.workspace_role))
    throw { status: 403, message: "Permission denied" };

  return member;
}
