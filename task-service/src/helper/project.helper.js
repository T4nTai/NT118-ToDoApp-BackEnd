import { projectInternalApi } from "../config/internalAPI.js";

export async function ensureProjectExists(project_id) {
  try {
    const res = await projectInternalApi.get(
      `/internal/project/${project_id}/exists`
    );
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: "Project không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi project-service" };
  }
}

export async function getProjectDetail(project_id) {
  try {
    const res = await projectInternalApi.get(`/internal/project/${project_id}`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: "Project không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi project-service" };
  }
}

export async function getProjectMembers(project_id) {
  try {
    const res = await projectInternalApi.get(
      `/internal/project/${project_id}/members`
    );
    return res.data.members || [];
  } catch (err) {
    throw { status: 500, message: "Lỗi gọi project-service (members)" };
  }
}

export async function ensureUserInProjectOrAssignedGroup(project_id, user_id) {
  const members = await getProjectMembers(project_id);
  const found = members.find((m) => m.user_id === Number(user_id));
  if (!found) {
    throw {
      status: 403,
      message: "User không thuộc project hoặc group được assign",
    };
  }
}

export async function getMilestoneDetail(milestone_id) {
  try {
    const res = await projectInternalApi.get(
      `/internal/milestone/${milestone_id}`
    );
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: "Milestone không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi project-service (milestone)" };
  }
}
