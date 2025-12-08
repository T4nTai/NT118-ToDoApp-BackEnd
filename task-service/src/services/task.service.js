// src/services/task.service.js
import { Task, Subtask } from "../models/index.js";
import { getUserById } from "../helper/auth.helper.js";
import {
  ensureProjectExists,
  ensureUserInProjectOrAssignedGroup,
  getProjectDetail,
  getMilestoneDetail,
} from "../helper/project.helper.js";

export async function createTaskService({
  title,
  description,
  project_id,
  milestone_id,
  assigned_to,
  created_by,
  priority,
  start_date,
  due_date,
}) {
  if (!title || !created_by) {
    throw { status: 400, message: "Thiếu title hoặc created_by" };
  }

  await getUserById(created_by);

  let step_id = null;

  if (project_id) {
    const project = await ensureProjectExists(project_id);

    if (assigned_to) {
      await getUserById(assigned_to);
      await ensureUserInProjectOrAssignedGroup(project.project_id, assigned_to);
    }
  }

  const task = await Task.create({
    title,
    description: description || null,
    project_id: project_id || null,
    milestone_id: milestone_id || null,
    created_by,
    assigned_to: assigned_to || null,
    priority: priority || "Medium",
    start_date: start_date || null,
    due_date: due_date || null,
    step_id,
  });

  return task;
}

export async function viewTasksInProjectService(
  project_id,
  statusFilter = null
) {
  const project = await getProjectDetail(project_id);

  const whereClause = {
    project_id,
    ...(statusFilter && { status: statusFilter }),
  };

  const tasks = await Task.findAll({
    where: whereClause,
    include: [
      {
        model: Subtask,
        as: "subtasks",
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return { project, total: tasks.length, tasks };
}

export async function viewTasksAssignToService(user_id, statusFilter) {
  await getUserById(user_id);

  const tasks = await Task.findAll({
    where: {
      assigned_to: user_id,
      ...(statusFilter && { status: statusFilter }),
    },
    include: [{ model: Subtask, as: "subtasks" }],
    order: [["created_at", "DESC"]],
  });

  return tasks;
}

export async function viewTasksCreatedByUserService(user_id, statusFilter) {
  await getUserById(user_id);

  const tasks = await Task.findAll({
    where: {
      created_by: user_id,
      ...(statusFilter && { status: statusFilter }),
    },
    include: [{ model: Subtask, as: "subtasks" }],
    order: [["created_at", "DESC"]],
  });

  return tasks;
}

export async function assignTaskService(task_id, user_id) {
  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  await getUserById(user_id);

  if (task.project_id) {
    await ensureUserInProjectOrAssignedGroup(task.project_id, user_id);
  }

  task.assigned_to = user_id;
  await task.save();

  return { message: "Giao task thành công", task };
}

export async function updateTaskService(task_id, updateData) {
  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "assigned_to",
    "step_id",
    "start_date",
    "due_date",
    "task_progress",
  ];

  const validUpdates = {};
  for (const key of Object.keys(updateData)) {
    if (allowedFields.includes(key)) {
      validUpdates[key] = updateData[key];
    }
  }

  if (Object.keys(validUpdates).length === 0) {
    throw { status: 400, message: "Không có field hợp lệ để cập nhật" };
  }

  if (
    validUpdates.assigned_to &&
    validUpdates.assigned_to !== task.assigned_to
  ) {
    await getUserById(validUpdates.assigned_to);
    if (task.project_id) {
      await ensureUserInProjectOrAssignedGroup(
        task.project_id,
        validUpdates.assigned_to
      );
    }
  }

  Object.assign(task, validUpdates);
  await task.save();

  return task;
}

export async function updateTaskStatusIfSubtasksCompletedService(task_id) {
  const task = await Task.findByPk(task_id, {
    include: [{ model: Subtask, as: "subtasks" }],
  });

  if (!task) throw { status: 404, message: "Task không tồn tại" };

  if (!task.subtasks || task.subtasks.length === 0) return task;

  const allCompleted = task.subtasks.every((s) => s.status === "Done");

  if (allCompleted && task.status !== "Done") {
    task.status = "Done";
    await task.save();
  }

  return task;
}

export async function deleteTaskService(task_id) {
  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  await task.destroy();
  return { message: "Xóa task thành công", task_id };
}

export async function viewTasksByMilestoneService(milestone_id, statusFilter) {
  const milestone = await getMilestoneDetail(milestone_id);

  const whereClause = {
    milestone_id,
    ...(statusFilter && { status: statusFilter }),
  };

  const tasks = await Task.findAll({
    where: whereClause,
    include: [{ model: Subtask, as: "subtasks" }],
    order: [["created_at", "DESC"]],
  });

  return { milestone, total: tasks.length, tasks };
}
