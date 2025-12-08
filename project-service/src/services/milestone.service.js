import { Milestone } from "../models/index.js";
import { checkProjectExistsService } from "../services/project.service.js";

export async function createMilestoneService(data) {
  const { project_id, name, description, start_date, due_date } = data;

  if (!project_id || !name) {
    throw { status: 400, message: "Thiếu project_id hoặc name" };
  }

  await checkProjectExistsService(project_id);

  const milestone = await Milestone.create({
    project_id,
    name,
    description: description || null,
    start_date: start_date || null,
    due_date: due_date || null,
    is_completed: false,
    completed_at: null,
  });

  return milestone;
}

export async function getMilestonesByProjectService(project_id) {
  await checkProjectExistsService(project_id);
  const milestones = await Milestone.findAll({
    where: { project_id },
  });
  return milestones;
}

export async function getMilestoneDetailService(milestone_id) {
  const milestone = await Milestone.findByPk(milestone_id);
  if (!milestone) {
    throw { status: 404, message: "Milestone không tồn tại" };
  }
  return milestone;
}

export async function updateMilestoneService(milestone_id, updates) {
  const milestone = await Milestone.findByPk(milestone_id);
  if (!milestone) {
    throw { status: 404, message: "Milestone không tồn tại" };
  }

  const allowed = ["name", "description", "start_date", "due_date"];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      milestone[key] = updates[key];
    }
  }

  await milestone.save();
  return milestone;
}

export async function completeMilestoneService(milestone_id) {
  const milestone = await Milestone.findByPk(milestone_id);
  if (!milestone) {
    throw { status: 404, message: "Milestone không tồn tại" };
  }

  milestone.is_completed = true;
  milestone.completed_at = new Date();
  await milestone.save();

  return { message: "Hoàn thành milestone thành công" };
}

export async function deleteMilestoneService(milestone_id) {
  const milestone = await Milestone.findByPk(milestone_id);
  if (!milestone) {
    throw { status: 404, message: "Milestone không tồn tại" };
  }

  await milestone.destroy();
  return { message: "Xoá milestone thành công" };
}
