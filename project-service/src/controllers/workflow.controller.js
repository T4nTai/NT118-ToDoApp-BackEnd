import { WorkflowService } from "../services/workflow.service.js";

export class WorkflowController {

  static async create(req, res) {
    try {
      const wf = await WorkflowService.createWorkflow({
        project_id: req.params.project_id,
        requester_id: Number(req.headers["x-user-id"]),
        ...req.body
      });
      res.json(wf);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async addStep(req, res) {
    try {
      const step = await WorkflowService.addStep({
        workflow_id: req.params.workflow_id,
        ...req.body
      });
      res.json(step);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async getSteps(req, res) {
    try {
      const steps = await WorkflowService.getSteps(req.params.workflow_id);
      res.json(steps);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
