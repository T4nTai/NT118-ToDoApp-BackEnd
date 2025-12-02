import { createTaskService, viewTasksByUserService, assignTaskService, updateTaskService, deleteTaskService } from "../services/taskservices.js";
  

export async function createTask(req, res, next) {
    try {
        const created_by = req.user.id;
        const taskData = { ...req.body, created_by };

        const task = await createTaskService(taskData);

        return res.status(201).json({ message: "Tạo task thành công", task });
    } catch (err) {
        if (err && err.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function viewTasksByUser(req, res, next) {
    try {
        const user_id = req.user.id;
        const { status } = req.query;

        const tasks = await viewTasksByUserService(user_id, status);

        return res.status(200).json({ tasks });
    } catch (err) {
        if (err && err.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function assignTask(req, res, next) {
    try {
        const { task_id } = req.params;
        const { user_id } = req.body;

        const result = await assignTaskService(task_id, user_id);

        return res.status(200).json(result);
    } catch (err) {
        if (err && err.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function updateTask(req, res, next) {
    try {
        const { task_id } = req.params;
        const updateData = req.body;

        const updatedTask = await updateTaskService(task_id, updateData);

        return res.status(200).json({ task: updatedTask });
    } catch (err) {
        if (err && err.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function deleteTask(req, res, next) {
    try {
        const { task_id } = req.params;

        const result = await deleteTaskService(task_id);

        return res.status(200).json(result);
    } catch (err) {
        if (err && err.status)
            return res.status(err.status).json({ message: err.message });
        next(err);
    }
}
