
import { ProjectInternalService } from "../../services/internal.service.js";

export class ProjectInternalController {


  static async exists(req, res) {
    try {
      const exists = await ProjectInternalService.exists(req.params.project_id);
      return res.json({ exists });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }


  static async detail(req, res) {
    try {
      const project = await ProjectInternalService.detail(req.params.project_id);
      return res.json({ project });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }


  static async members(req, res) {
    try {
      const members = await ProjectInternalService.members(req.params.project_id);
      return res.json({ members });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async checkMember(req, res) {
    try {
      const is_member = await ProjectInternalService.checkMember(
        req.params.project_id,
        req.params.user_id
      );

      return res.json({ is_member });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async userProjects(req, res) {
    try {
      const projects = await ProjectInternalService.userProjects(req.params.user_id);
      return res.json({ projects });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
}
