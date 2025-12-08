import { Task } from "../models/index.js";
import {
  viewTasksInProjectService,
  viewTasksAssignToService,
} from "../services/task.service.js";

export class TaskInternalController {
  static async detail(req, res, next) {
    try {
      const { task_id } = req.params;
      const task = await Task.findByPk(task_id);

      if (!task) {
        return res.status(404).json({ message: "Task không tồn tại" });
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  static async byProject(req, res, next) {
    try {
      const { project_id } = req.params;
      const data = await viewTasksInProjectService(project_id, null);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  static async assignedToUser(req, res, next) {
    try {
      const { user_id } = req.params;
      const tasks = await viewTasksAssignToService(user_id, null);
      res.json({ user_id, tasks });
    } catch (err) {
      next(err);
    }
  }
}