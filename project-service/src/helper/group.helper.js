import { groupInternalApi } from "../config/internalAPI.js";

export async function ensureGroupExists(group_id) {
  try {
    const res = await groupInternalApi.get(`/internal/group/${group_id}/exists`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, message: "Group không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi group-service" };
  }
}

export async function getGroupMembers(group_id) {
  try {
    const res = await internalApi.get(
      `/internal/group/${group_id}/members`
    );
    return res.data.members || [];
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, message: "Group không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi group-service" };
  }
}
