import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import {
  internalCheckWorkspaceExists,
  internalGetWorkspaceMembers,
  internalCheckWorkspaceMember,
  internalGetUserWorkspaces,
} from "../controllers/internal.controller.js";

const InternalRouter = Router();

InternalRouter.use(internalMiddleware);

InternalRouter.get("/:workspace_id/exists", internalCheckWorkspaceExists);
InternalRouter.get("/:workspace_id/members", internalGetWorkspaceMembers);
InternalRouter.get("/:workspace_id/member/:user_id", internalCheckWorkspaceMember);
InternalRouter.get("/user/:user_id/workspaces", internalGetUserWorkspaces);

export default InternalRouter;
