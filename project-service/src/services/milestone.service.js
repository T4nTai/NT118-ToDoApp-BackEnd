import { Milestone } from "../models/milestone.model.js";
import { checkProjectMember } from "../helper/checkMember.js";

export class MilestoneService {

  static async create({ project_id, name, description, due_date, requester_id }) {
    await checkProjectMember(project_id, requester_id);

    return await Milestone.create({
      project_id,
      name,
      description,
      due_date,
      is_completed: false
    });
  }

  static async list(project_id, requester_id) {
    await checkProjectMember(project_id, requester_id);
    return await Milestone.findAll({ where: { project_id } });
  }

  static async detail(milestone_id, requester_id) {
    const mile = await Milestone.findByPk(milestone_id);
    if (!mile) throw { status: 404, message: "Milestone not found" };

    await checkProjectMember(mile.project_id, requester_id);

    return mile;
  }

  static async update({ milestone_id, requester_id, ...data }) {
    const mile = await Milestone.findByPk(milestone_id);
    if (!mile) throw { status: 404, message: "Milestone not found" };

    await checkProjectMember(mile.project_id, requester_id);

    await Milestone.update(data, { where: { milestone_id } });
    return await Milestone.findByPk(milestone_id);
  }

  static async delete({ milestone_id, requester_id }) {
    const mile = await Milestone.findByPk(milestone_id);
    if (!mile) throw { status: 404, message: "Milestone not found" };

    await checkProjectMember(mile.project_id, requester_id);

    await Milestone.destroy({ where: { milestone_id } });
    return true;
  }
}
