import { PerformanceRecord } from "../models/performance_record.model.js";
import { checkProjectMember } from "../helper/project.helper.js";
import { checkUserExists } from "../helper/validateUser.js";

export class PerformanceService {

  static async create({
    project_id,
    group_id,
    target_user_id,
    score,
    comment,
    requester_id
  }) {
    await checkProjectMember(project_id, requester_id);
    await checkUserExists(target_user_id);

    return await PerformanceRecord.create({
      project_id,
      group_id: group_id || null,
      user_id: target_user_id,
      created_by: requester_id,
      score,
      comment
    });
  }

  static async byProject(project_id, requester_id) {
    await checkProjectMember(project_id, requester_id);
    return await PerformanceRecord.findAll({ where: { project_id } });
  }

  static async byUser(target_user_id) {
    return await PerformanceRecord.findAll({ where: { user_id: target_user_id } });
  }

  static async byGroup(group_id) {
    return await PerformanceRecord.findAll({ where: { group_id } });
  }
}
