import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller.js";

const WorkspaceRouter = Router();

WorkspaceRouter.post("/", WorkspaceController.create);
WorkspaceRouter.get("/", WorkspaceController.myWorkspaces);
WorkspaceRouter.get("/:id", WorkspaceController.detail);
WorkspaceRouter.delete("/:id", WorkspaceController.delete);

export default WorkspaceRouter;
