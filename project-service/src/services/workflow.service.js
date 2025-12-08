import { Workflow } from "../models/workflow.model.js";
import { WorkflowStep } from "../models/workflow_step.model.js";
import { checkProjectMember } from "../helper/project.helper.js";

export class WorkflowService {

  static async createWorkflow({ project_id, name, description, requester_id }) {
    await checkProjectMember(project_id, requester_id);

    return await Workflow.create({
      project_id,
      name,
      description
    });
  }

  static async addStep({ workflow_id, name, step_order }) {
    return await WorkflowStep.create({
      workflow_id,
      name,
      step_order
    });
  }

  static async getSteps(workflow_id) {
    return await WorkflowStep.findAll({
      where: { workflow_id },
      order: [["step_order", "ASC"]]
    });
  }
}
