import { internalApi } from "../../config/internalApi.js";
import { WORKSPACE_SERVICE_URL } from "../../config/env.js";

export async function checkWorkspaceExists(workspace_id) {
  try {
    const res = await internalApi.get(
      `${WORKSPACE_SERVICE_URL}/internal/workspace/${workspace_id}/exists`
    );
    return res.data.exists;
  } catch {
    throw { status: 503, message: "Workspace service unavailable" };
  }
}
