import { workspaceInternalApi } from "../config/internalAPI.js";

export async function ensureWorkspaceExists(workspace_id) {
  try {
    const res = await  workspaceInternalApi.get(
      `/internal/workspace/${workspace_id}/exists`
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, message: "Workspace không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi workspace-service" };
  }
}
