// src/controllers/subtask.controller.js
import {
  createSubtaskService,
  updateSubtaskService,
  deleteSubtaskService,
} from "../services/subtask.service.js";

export class SubtaskController {
  static async create(req, res) {
    try {
      const { task_id } = req.params;
      const subtask = await createSubtaskService(task_id, req.body);

      res.status(201).json(subtask);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { subtask_id } = req.params;
      const subtask = await updateSubtaskService(subtask_id, req.body);

      res.status(200).json(subtask);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { subtask_id } = req.params;
      const result = await deleteSubtaskService(subtask_id);

      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
