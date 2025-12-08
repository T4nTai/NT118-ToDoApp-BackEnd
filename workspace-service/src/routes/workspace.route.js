import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceDetail
} from "../controllers/workspace.controller.js";

const WorkspaceRouter = Router();

WorkspaceRouter.use(authenticateFromGateway);

WorkspaceRouter.post("/", createWorkspace);
WorkspaceRouter.get("/", getMyWorkspaces);
WorkspaceRouter.get("/:workspace_id", getWorkspaceDetail);

export default WorkspaceRouter;
