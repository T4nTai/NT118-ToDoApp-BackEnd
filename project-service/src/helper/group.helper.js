import { internalApi } from "../../config/internalApi.js";
import { GROUP_SERVICE_URL } from "../../config/env.js";

export async function checkGroupExists(group_id) {
  try {
    const res = await internalApi.get(
      `${GROUP_SERVICE_URL}/internal/group/${group_id}/exists`
    );
    return res.data.exists;
  } catch {
    throw { status: 503, message: "Group service unavailable" };
  }
}

export async function getGroupMembers(group_id) {
  const res = await internalApi.get(
    `${GROUP_SERVICE_URL}/internal/group/${group_id}/members`,
    {
      headers: { "x-internal-token": INTERNAL_SECRET }
    }
  );

  return res.data.members; 
}