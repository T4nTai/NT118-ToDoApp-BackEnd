// src/controllers/performance.controller.js
import {
  evaluateMemberInGroupService,
  evaluateMemberInProjectService,
  getGroupPerformanceService,
  getProjectPerformanceService,
} from "../services/performance.service.js";

export class PerformanceController {
  // Đánh giá thành viên trong GROUP
  // POST /performance/group
  static async evaluateInGroup(req, res) {
    try {
      const created_by = Number(req.headers["x-user-id"]);
      const { group_id, user_id, score, comment } = req.body;

      const record = await evaluateMemberInGroupService({
        group_id,
        user_id,
        score,
        comment,
        created_by,
      });

      res.status(201).json(record);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  // Đánh giá thành viên trong PROJECT
  // POST /performance/project
  static async evaluateInProject(req, res) {
    try {
      const created_by = Number(req.headers["x-user-id"]);
      const { project_id, user_id, score, comment } = req.body;

      const record = await evaluateMemberInProjectService({
        project_id,
        user_id,
        score,
        comment,
        created_by,
      });

      res.status(201).json(record);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  // Xem performance theo GROUP (có thể filter theo user_id)
  // GET /performance/group/:group_id?user_id=...
  static async byGroup(req, res) {
    try {
      const { group_id } = req.params;
      const { user_id } = req.query; // optional

      const data = await getGroupPerformanceService(
        group_id,
        user_id ? Number(user_id) : undefined
      );

      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  // Xem performance theo PROJECT (có thể filter theo user_id)
  // GET /performance/project/:project_id?user_id=...
  static async byProject(req, res) {
    try {
      const { project_id } = req.params;
      const { user_id } = req.query; // optional

      const data = await getProjectPerformanceService(
        project_id,
        user_id ? Number(user_id) : undefined
      );

      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
