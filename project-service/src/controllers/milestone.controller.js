import {
  createMilestoneService,
  getMilestonesByProjectService,
  getMilestoneDetailService,
  updateMilestoneService,
  completeMilestoneService,
  deleteMilestoneService,
} from "../services/milestone.service.js";

export class MilestoneController {
  static async create(req, res) {
    try {
      const { project_id } = req.params;
      const { name, description, start_date, due_date } = req.body;

      const milestone = await createMilestoneService({
        project_id,
        name,
        description,
        start_date,
        due_date,
      });

      res.status(201).json(milestone);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async list(req, res) {
    try {
      const { project_id } = req.params;

      const data = await getMilestonesByProjectService(project_id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async detail(req, res) {
    try {
      const { milestone_id } = req.params;

      const detail = await getMilestoneDetailService(milestone_id);
      res.json(detail);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { milestone_id } = req.params;
      const updates = req.body;

      const updated = await updateMilestoneService(milestone_id, updates);
      res.json(updated);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async complete(req, res) {
    try {
      const { milestone_id } = req.params;

      const result = await completeMilestoneService(milestone_id);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { milestone_id } = req.params;

      const result = await deleteMilestoneService(milestone_id);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
