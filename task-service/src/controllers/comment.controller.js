// src/controllers/comment.controller.js
import {
  createCommentService,
  updateCommentService,
  deleteCommentService,
  getCommentsByTaskService,
  getCommentHistoryService,
} from "../services/comment.service.js";

export class CommentController {
  static async create(req, res) {
    try {
      const user_id = req.user.id;
      const { task_id, content } = req.body;

      const comment = await createCommentService({ task_id, user_id, content });

      res.status(201).json(comment);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const user_id = req.user.id;
      const { comment_id } = req.params;
      const { content } = req.body;

      const comment = await updateCommentService(comment_id, user_id, content);

      res.status(200).json(comment);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const user_id = req.user.id;
      const { comment_id } = req.params;

      const result = await deleteCommentService(comment_id, user_id);

      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async listByTask(req, res) {
    try {
      const { task_id } = req.params;

      const comments = await getCommentsByTaskService(task_id);

      res.status(200).json({ task_id, comments });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async history(req, res) {
    try {
      const { comment_id } = req.params;

      const history = await getCommentHistoryService(comment_id);

      res.status(200).json({ comment_id, history });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
