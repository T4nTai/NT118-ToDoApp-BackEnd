import { Workspace } from "../models/workspace.model.js";

export async function checkWorkspaceExists(workspace_id) {
  const ws = await Workspace.findByPk(workspace_id);
  if (!ws) throw { status: 404, message: "Workspace not found" };
  return ws;
}