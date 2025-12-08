import { Workspace, WorkspaceMember } from "../models/index.js";


export async function checkWorkspaceExistsService(workspace_id) {
  const workspace = await Workspace.findByPk(workspace_id);
  if (!workspace) {
    throw { status: 404, message: "Workspace không tồn tại" };
  }
  return workspace;
}

export async function getWorkspaceMembersService(workspace_id) {
  await checkWorkspaceExistsService(workspace_id);

  const members = await WorkspaceMember.findAll({
    where: { workspace_id },
  });

  return members;
}

export async function checkWorkspaceMemberService(workspace_id, user_id) {
  const member = await WorkspaceMember.findOne({
    where: { workspace_id, user_id },
  });

  if (!member) {
    throw { status: 404, message: "User không thuộc workspace" };
  }

  return member;
}

export async function getUserWorkspacesInternalService(user_id) {
  const members = await WorkspaceMember.findAll({
    where: { user_id },
  });

  return members.map((m) => ({
    workspace_id: m.workspace_id,
    workspace_role: m.workspace_role,
  }));
}
