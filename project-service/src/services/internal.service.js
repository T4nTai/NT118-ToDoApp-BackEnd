import { Project } from "../../models/project.model.js";
import { ProjectMember } from "../../models/project_member.model.js";

export class ProjectInternalService {


  static async exists(project_id) {
    const project = await Project.findByPk(project_id);
    return !!project;
  }

  static async detail(project_id) {
    const project = await Project.findByPk(project_id);

    if (!project) {
      throw { status: 404, message: "Project not found" };
    }

    return project;
  }

  
  static async members(project_id) {
    const members = await ProjectMember.findAll({
      where: { project_id },
      attributes: ["user_id", "role"]
    });

    return members;
  }

  
  static async checkMember(project_id, user_id) {
    const exists = await ProjectMember.findOne({
      where: { project_id, user_id }
    });

    return !!exists;
  }

  
  static async userProjects(user_id) {
    const list = await ProjectMember.findAll({
      where: { user_id },
      include: [
        {
          model: Project,
          attributes: ["project_id", "name", "description", "priority", "status"]
        }
      ]
    });

    return list;
  }
}
