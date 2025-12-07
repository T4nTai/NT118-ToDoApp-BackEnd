import { WorkspaceService } from "../services/workspace.service.js";

export class WorkspaceController {
  static async create(req, res) {
    try {
      const owner_id = Number(req.headers["x-user-id"]);
      const ws = await WorkspaceService.createWorkspace({
        ...req.body,
        owner_id
      });

      return res.json({ message: "Workspace created", workspace: ws });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
  static async myWorkspaces(req, res) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      console.log("REQ.USER =", req.user);
      console.log("REQ.HEADERS =", req.headers);
      console.log("USER ID =", user_id);
      const list = await WorkspaceService.getUserWorkspaces(user_id);
      return res.json(list);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  static async detail(req, res) {
    try {
      const ws = await WorkspaceService.getWorkspaceDetail(req.params.id);
      if (!ws) return res.status(404).json({ message: "Workspace not found" });
      return res.json(ws);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async members(req, res) {
    try {
      const { workspace_id } = req.params;

      const members = await WorkspaceService.getMembers(workspace_id);
      return res.json(members);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async addMember(req, res) {
    try {
      const { workspace_id } = req.params;
      const { user_id, role } = req.body;

      const requester_id = Number(req.headers["x-user-id"]);

      const result = await WorkspaceService.addMember({
        workspace_id,
        target_user_id: user_id,
        role,
        requester_id
      });

      return res.json({ message: "Member added", member: result });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
  static async removeMember(req, res) {
    try {
      const { workspace_id, user_id } = req.params;
      const requester_id = Number(req.headers["x-user-id"]);

      await WorkspaceService.removeMember({
        workspace_id,
        target_user_id: user_id,
        requester_id
      });

      return res.json({ message: "Member removed" });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async checkAccess(req, res) {
    try {
      const { workspace_id } = req.params;
      const user_id = Number(req.headers["x-user-id"]);

      const data = await WorkspaceService.checkAccess(workspace_id, user_id);

      return res.json(data);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
}
