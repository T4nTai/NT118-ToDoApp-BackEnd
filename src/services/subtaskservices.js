import { Task } from '../models/task.model.js';
import { Subtask } from '../models/subtask.model.js';


export async function createSubtaskService(task_id, { title, description, priority, status }) {
    if (!task_id) {
        throw { status: 400, message: "Thiếu task_id để tạo subtask" };
    }
    if (!title) {
        throw { status: 400, message: "Subtask cần có title" };
    }
    const task = await Task.findByPk(task_id);
    if (!task) {
        throw { status: 404, message: "Task không tồn tại" };
    }
    const subtask = await Subtask.create({
        task_id,
        title,
        description: description || null,
        priority: priority || "Medium",
        status: status || "To Do"
    });

    return subtask;
}

export async function viewSubtaskByTaskService(task_id, statusFilter) {
  const subtasks = await Subtask.findAll({
    where: {
      task_id: task_id,
      ...(statusFilter && { status: statusFilter })
    },
    include: [
      {
        model: Task,
        as: "task",
        attributes: ["task_id", "title", "status"]
      }
    ]
  });

  return subtasks;
}

export async function updateSubtaskService(subtask_id, updateData) {
    const subtask = await Subtask.findByPk(subtask_id);

    if (!subtask) {
        throw { status: 404, message: "Subtask không tồn tại" };
    }
    const allowedFields = [
        "title",
        "description",
        "priority",
        "status"
    ];
    const validUpdates = {};
    for (const key of Object.keys(updateData)) {
        if (allowedFields.includes(key)) {
            validUpdates[key] = updateData[key];
        }
    }
    if (Object.keys(validUpdates).length === 0) {
        throw { status: 400, message: "Không có thuộc tính hợp lệ để cập nhật" };
    }
    Object.assign(subtask, validUpdates);
    await subtask.save();
    return subtask;
}





