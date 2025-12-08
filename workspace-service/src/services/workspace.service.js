import { Workspace, WorkspaceMember } from "../models/index.js";
import crypto from 'crypto';

async function ensureWorkspaceTokenUnique() {
  while (true) {
    const token = crypto.randomBytes(3).toString("hex");
    const existed = await Workspace.findOne({ where: { workspace_token: token } });
    if (!existed) return token;
  }
}

export async function createWorkspaceService({ name, description, owner_id }) {
  if (!name || !owner_id) {
    throw { status: 400, message: "Thiếu name hoặc owner_id" };
  }

  const workspace_token = await ensureWorkspaceTokenUnique();

  const workspace = await Workspace.create({
    name,
    description: description || null,
    workspace_token,
  });

  await WorkspaceMember.create({
    workspace_id: workspace.workspace_id,
    user_id: owner_id,
    workspace_role: "Owner",
  });

  return workspace;
}

export async function getUserWorkspacesService(user_id) {
  const members = await WorkspaceMember.findAll({
    where: { user_id },
    include: [
      {
        model: Workspace,
        as: "workspace",
      },
    ],
  });

  return members.map((m) => ({
    workspace_id: m.workspace_id,
    role: m.workspace_role,
    workspace: {
      workspace_id: m.workspace.workspace_id,
      name: m.workspace.name,
      description: m.workspace.description,
      workspace_token: m.workspace.workspace_token,
      created_at: m.workspace.created_at,
    },
  }));
}

export async function getWorkspaceDetailForUserService(workspace_id, user_id) {
  const member = await WorkspaceMember.findOne({
    where: { workspace_id, user_id },
    include: [{ model: Workspace, as: "workspace" }],
  });

  if (!member) {
    throw { status: 403, message: "Bạn không thuộc workspace này" };
  }

  const w = member.workspace;

  return {
    workspace_id: w.workspace_id,
    name: w.name,
    description: w.description,
    workspace_token: w.workspace_token,
    created_at: w.created_at,
    user_role: member.workspace_role,
  };
}
