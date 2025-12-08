import {
  checkProjectExistsService,
  getProjectDetailService,
  getProjectMembersService,
  getUserProjectsInternalService,
} from "../services/project.service.js";

export class ProjectInternalController {

  static async exists(req, res, next) {
    try {
      const { project_id } = req.params;
      const project = await checkProjectExistsService(project_id);

      return res.json({
        exists: true,
        project_id: project.project_id,
        workspace_id: project.workspace_id,
        owner_id: project.owner_id,
        assigned_group_id: project.assigned_group_id,
        assigned_user_id: project.assigned_user_id,
      });
    } catch (err) {
      if (err && err.status)
        return res.status(err.status).json({ message: err.message });
      next(err);
    }
  }

  static async detail(req, res, next) {
    try {
      const { project_id } = req.params;
      const project = await getProjectDetailService(project_id);
      return res.json(project);
    } catch (err) {
      if (err && err.status)
        return res.status(err.status).json({ message: err.message });
      next(err);
    }
  }

  static async members(req, res, next) {
    try {
      const { project_id } = req.params;
      const members = await getProjectMembersService(project_id);
      return res.json({ project_id, members });
    } catch (err) {
      if (err && err.status)
        return res.status(err.status).json({ message: err.message });
      next(err);
    }
  }

  static async userProjects(req, res, next) {
    try {
      const { user_id } = req.params;
      const projects = await getUserProjectsInternalService(user_id);
      return res.json({ user_id, projects });
    } catch (err) {
      if (err && err.status)
        return res.status(err.status).json({ message: err.message });
      next(err);
    }
  }
}
