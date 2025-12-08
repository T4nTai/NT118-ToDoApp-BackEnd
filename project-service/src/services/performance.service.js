import { PerformanceRecord } from "../models/index.js";
import { ensureGroupExists } from "../helper/group.helper.js";
import { checkProjectExistsService } from "../services/project.service.js";
import { getUserById } from "../helper/auth.helper.js";


export async function evaluateMemberInGroupService({
  group_id,
  user_id,
  score,
  comment,
  created_by,
}) {
  if (!group_id || !user_id || score == null || created_by == null) {
    throw { status: 400, message: "Thiếu group_id, user_id, score hoặc created_by" };
  }

  await ensureGroupExists(group_id);
  await getUserById(user_id);
  await getUserById(created_by);

  const record = await PerformanceRecord.create({
    group_id,
    user_id,
    score,
    comment: comment || null,
    created_by,
    created_at: new Date(),
  });

  return record;
}

export async function evaluateMemberInProjectService({
  project_id,
  user_id,
  score,
  comment,
  created_by,
}) {
  if (!project_id || !user_id || score == null || created_by == null) {
    throw {
      status: 400,
      message: "Thiếu project_id, user_id, score hoặc created_by",
    };
  }

  const project = await checkProjectExistsService(project_id);
  await getUserById(user_id);
  await getUserById(created_by);

  const record = await PerformanceRecord.create({
    project_id,
    group_id: project.assigned_group_id || null,
    user_id,
    score,
    comment: comment || null,
    created_by,
    created_at: new Date(),
  });

  return record;
}

export async function getGroupPerformanceService(group_id, user_id) {
  if (!group_id) throw { status: 400, message: "Thiếu group_id" };

  const where = { group_id };
  if (user_id) {
    where.user_id = user_id;
  }

  const records = await PerformanceRecord.findAll({ where });
  return records;
}

export async function getProjectPerformanceService(project_id, user_id) {
  if (!project_id) throw { status: 400, message: "Thiếu project_id" };

  const where = { project_id };
  if (user_id) {
    where.user_id = user_id;
  }

  const records = await PerformanceRecord.findAll({ where });
  return records;
}
