import { createSubtaskService, viewSubtaskByTaskService, updateSubtaskService } from "../services/subtaskservices.js";

export async function createSubtask(req, res, next) {
    try {
        const { task_id } = req.params;
        const subtaskData = req.body;

        const subtask = await createSubtaskService(task_id, subtaskData);

        return res.status(201).json({
            message: "Tạo subtask thành công",
            subtask
        });
    } catch (err) {
        if (err?.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function viewSubtaskByTask(req, res, next) {
    try {
        const { task_id } = req.params;
        const { status } = req.query;

        const subtasks = await viewSubtaskByTaskService(task_id, status);

        return res.status(200).json({ subtasks });
    } catch (err) {
        if (err?.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function updateSubtask(req, res, next) {
    try {
        const { subtask_id } = req.params;
        const updateData = req.body;

        const updatedSubtask = await updateSubtaskService(subtask_id, updateData);

        return res.status(200).json({
            message: "Cập nhật subtask thành công",
            subtask: updatedSubtask
        });
    } catch (err) {
        if (err?.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}
