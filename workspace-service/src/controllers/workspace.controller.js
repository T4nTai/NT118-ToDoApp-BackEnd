import {
  createWorkspaceService,
  getUserWorkspacesService,
  getWorkspaceDetailForUserService,
} from "../services/workspace.service.js";

export async function createWorkspace(req, res, next) {
  try {
    const owner_id = req.user.id;
    const { name, description } = req.body;

    const workspace = await createWorkspaceService({
      name,
      description,
      owner_id,
    });

    return res.status(201).json({
      message: "Tạo workspace thành công",
      workspace,
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getMyWorkspaces(req, res, next) {
  try {
    const user_id = req.user.id;
    const workspaces = await getUserWorkspacesService(user_id);

    return res.status(200).json({ workspaces });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getWorkspaceDetail(req, res, next) {
  try {
    const user_id = req.user.id;
    const workspace_id = parseInt(req.params.workspace_id, 10);

    const data = await getWorkspaceDetailForUserService(
      workspace_id,
      user_id
    );

    return res.status(200).json({ workspace: data });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
