// src/controllers/task.controller.js
import {
  createTaskService,
  viewTasksInProjectService,
  viewTasksAssignToService,
  viewTasksCreatedByUserService,
  assignTaskService,
  updateTaskService,
  deleteTaskService,
  viewTasksByMilestoneService,
} from "../services/task.service.js";

export class TaskController {
  static async create(req, res) {
    try {
      const created_by = req.user.id;
      const taskData = { ...req.body, created_by };

      const task = await createTaskService(taskData);

      res.status(201).json({ message: "Tạo task thành công", task });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async viewTasksAssignToUser(req, res) {
    try {
      const user_id = req.user.id;
      const { status } = req.query;

      const tasks = await viewTasksAssignToService(user_id, status);

      res.status(200).json({ tasks });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async viewTasksCreatedByUser(req, res) {
    try {
      const user_id = req.user.id;
      const { status } = req.query;

      const tasks = await viewTasksCreatedByUserService(user_id, status);

      res.status(200).json({ tasks });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async viewTasksInProject(req, res) {
    try {
      const { project_id } = req.params;
      const { status } = req.query;

      const data = await viewTasksInProjectService(project_id, status);

      res.status(200).json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async viewTasksByMilestone(req, res) {
    try {
      const { milestone_id } = req.params;
      const { status } = req.query;

      const data = await viewTasksByMilestoneService(milestone_id, status);

      res.status(200).json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async assignTask(req, res) {
    try {
      const { task_id } = req.params;
      const { user_id } = req.body;

      const result = await assignTaskService(task_id, user_id);

      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { task_id } = req.params;
      const updates = req.body;

      const task = await updateTaskService(task_id, updates);

      res.status(200).json({ message: "Cập nhật task thành công", task });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { task_id } = req.params;

      const result = await deleteTaskService(task_id);

      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
