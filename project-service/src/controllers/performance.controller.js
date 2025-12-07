import { PerformanceService } from "../services/performance.service.js";

export class PerformanceController {

  static async create(req, res) {
    try {
      const data = await PerformanceService.create({
        ...req.body,
        requester_id: Number(req.headers["x-user-id"])
      });
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async byProject(req, res) {
    try {
      const data = await PerformanceService.byProject(
        req.params.project_id,
        Number(req.headers["x-user-id"])
      );
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async byUser(req, res) {
    try {
      const data = await PerformanceService.byUser(req.params.user_id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async byGroup(req, res) {
    try {
      const data = await PerformanceService.byGroup(req.params.group_id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
