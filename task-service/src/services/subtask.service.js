// src/services/subtask.service.js
import { Task, Subtask } from "../models/index.js";
import { updateTaskStatusIfSubtasksCompletedService } from "./task.service.js";

export async function createSubtaskService(task_id, data) {
  const { title, description, priority, status, due_date } = data;

  if (!task_id) throw { status: 400, message: "Thiếu task_id để tạo subtask" };
  if (!title) throw { status: 400, message: "Subtask cần có title" };

  const task = await Task.findByPk(task_id);
  if (!task) throw { status: 404, message: "Task không tồn tại" };

  const subtask = await Subtask.create({
    task_id,
    title,
    description: description || null,
    priority: priority || "Medium",
    status: status || "To Do",
    due_date: due_date || null,
  });

  await updateTaskStatusIfSubtasksCompletedService(task_id);

  return subtask;
}

export async function updateSubtaskService(subtask_id, updates) {
  const subtask = await Subtask.findByPk(subtask_id);
  if (!subtask) throw { status: 404, message: "Subtask không tồn tại" };

  const allowed = ["title", "description", "priority", "status", "due_date"];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      subtask[key] = updates[key];
    }
  }

  await subtask.save();

  await updateTaskStatusIfSubtasksCompletedService(subtask.task_id);

  return subtask;
}

export async function deleteSubtaskService(subtask_id) {
  const subtask = await Subtask.findByPk(subtask_id);
  if (!subtask) throw { status: 404, message: "Subtask không tồn tại" };

  const task_id = subtask.task_id;
  await subtask.destroy();

  await updateTaskStatusIfSubtasksCompletedService(task_id);

  return { message: "Xóa subtask thành công", deleted_subtask_id: subtask_id };
}
