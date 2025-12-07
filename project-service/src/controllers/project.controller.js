import { ProjectService } from "../services/project.service.js";

export class ProjectController {

  static async create(req, res) {
    try {
      const owner_id = Number(req.headers["x-user-id"]);
      const project = await ProjectService.createProject({
        ...req.body,
        owner_id
      });

      res.json(project);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async detail(req, res) {
    try {
      const data = await ProjectService.getProjectDetail(req.params.project_id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await ProjectService.updateProject({
        project_id: req.params.project_id,
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
      await ProjectService.deleteProject({
        project_id: req.params.project_id,
        requester_id: Number(req.headers["x-user-id"])
      });
      res.json({ message: "Project deleted" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async addMember(req, res) {
    try {
      const result = await ProjectService.addMember({
        project_id: req.params.project_id,
        target_user_id: req.body.user_id,
        role: req.body.role,
        requester_id: Number(req.headers["x-user-id"])
      });
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async removeMember(req, res) {
    try {
      await ProjectService.removeMember({
        project_id: req.params.project_id,
        target_user_id: req.params.user_id,
        requester_id: Number(req.headers["x-user-id"])
      });
      res.json({ message: "Member removed" });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async assignGroup(req, res) {
  try {
    const project_id = req.params.project_id;
    const group_id = req.body.group_id;
    const requester_id = Number(req.headers["x-user-id"]);
    const role = req.body.role || "Member";
    if (!group_id) {
      return res.status(400).json({ message: "group_id is required" });
    }
    const project = await ProjectService.assignGroup({
      project_id,
      group_id,
      requester_id,
      role
    });
    return res.json({
      message: "Group assigned successfully",
      role,
      project
    });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
}


  static async assignUser(req, res) {
  try {
    const project_id = req.params.project_id;
    const target_user_id = req.body.user_id;
    const requester_id = Number(req.headers["x-user-id"]);
    const role = req.body.role || "Member";
    if (!target_user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const project = await ProjectService.assignToUser({
      project_id,
      target_user_id,
      requester_id,
      role
    });
    return res.json({
      message: "User assigned successfully",
      role,
      project
    });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
}

}
