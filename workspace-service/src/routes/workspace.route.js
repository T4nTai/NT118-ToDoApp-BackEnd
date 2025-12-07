import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller.js";

const WorkspaceRouter = Router();
WorkspaceRouter.post("/", WorkspaceController.create);

WorkspaceRouter.get("/mine", WorkspaceController.myWorkspaces);

WorkspaceRouter.get("/:id", WorkspaceController.detail);

WorkspaceRouter.get("/:workspace_id/members", WorkspaceController.members);

WorkspaceRouter.post("/:workspace_id/members", WorkspaceController.addMember);

WorkspaceRouter.delete("/:workspace_id/members/:user_id", WorkspaceController.removeMember);

WorkspaceRouter.get("/:workspace_id/access", WorkspaceController.checkAccess);

export default WorkspaceRouter ;
