import { WorkspaceService } from "../services/workspace.service.js";

export class WorkspaceController {
  static async create(req, res, next) {
    try {
      const owner_id = Number(req.headers["x-user-id"]);
      const ws = await WorkspaceService.createWorkspace({
        ...req.body,
        owner_id
      });
      res.json(ws);
    } catch (err) {
      next(err);
    }
  }

  static async detail(req, res, next) {
    try {
      const ws = await WorkspaceService.getWorkspaceDetail(req.params.id);
      res.json(ws);
    } catch (err) {
      next(err);
    }
  }

  static async myWorkspaces(req, res, next) {
    try {
      const user_id = Number(req.headers["x-user-id"]);
      const list = await WorkspaceService.getUserWorkspaces(user_id);
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const owner_id = Number(req.headers["x-user-id"]);
      const ws = await WorkspaceService.updateWorkspace(req.params.id, owner_id, req.body);
      res.json(ws);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const owner_id = Number(req.headers["x-user-id"]);
      const data = await WorkspaceService.deleteWorkspace(req.params.id, owner_id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
