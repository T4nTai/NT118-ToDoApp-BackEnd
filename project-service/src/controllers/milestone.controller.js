import { MilestoneService } from "../services/milestone.service.js";

export class MilestoneController {

  static async create(req, res) {
    try {
      const milestone = await MilestoneService.create({
        project_id: req.params.project_id,
        requester_id: Number(req.headers["x-user-id"]),
        ...req.body
      });
      res.json(milestone);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async list(req, res) {
    try {
      const data = await MilestoneService.list(
        req.params.project_id,
        Number(req.headers["x-user-id"])
      );
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async detail(req, res) {
    try {
      const detail = await MilestoneService.detail(
        req.params.milestone_id,
        Number(req.headers["x-user-id"])
      );
      res.json(detail);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await MilestoneService.update({
        milestone_id: req.params.milestone_id,
        requester_id: Number(req.headers["x-user-id"]),
        ...req.body
      });
      res.json(updated);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      await MilestoneService.delete({
        milestone_id: req.params.milestone_id,
        requester_id: Number(req.headers["x-user-id"])
      });
      res.json({ message: "Milestone deleted" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
