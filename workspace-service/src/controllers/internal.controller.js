import {
  checkWorkspaceExistsService,
  getWorkspaceMembersService,
  checkWorkspaceMemberService,
  getUserWorkspacesInternalService,
} from "../services/internal.service.js";

export async function internalCheckWorkspaceExists(req, res, next) {
  try {
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const workspace = await checkWorkspaceExistsService(workspace_id);

    return res.status(200).json({
      exists: true,
      workspace_id: workspace.workspace_id,
      name: workspace.name,
      workspace_token: workspace.workspace_token,
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalGetWorkspaceMembers(req, res, next) {
  try {
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const members = await getWorkspaceMembersService(workspace_id);

    return res.status(200).json({ members });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalCheckWorkspaceMember(req, res, next) {
  try {
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const user_id = parseInt(req.params.user_id, 10);

    const member = await checkWorkspaceMemberService(workspace_id, user_id);

    return res.status(200).json({
      exists: true,
      workspace_id: member.workspace_id,
      user_id: member.user_id,
      workspace_role: member.workspace_role,
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalGetUserWorkspaces(req, res, next) {
  try {
    const user_id = parseInt(req.params.user_id, 10);

    const workspaces = await getUserWorkspacesInternalService(user_id);

    return res.status(200).json({ workspaces });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}