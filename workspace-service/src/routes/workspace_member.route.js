import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import {
  addMember,
  updateMemberRole,
  removeMember
} from "../controllers/workspace_member.controller.js";

const Workspace_memberRouter = Router();
Workspace_memberRouter.use(authenticateFromGateway)

Workspace_memberRouter.post("/:workspace_id/members", addMember);
Workspace_memberRouter.patch("/:workspace_id/members/:user_id", updateMemberRole);
Workspace_memberRouter.delete("/:workspace_id/members/:user_id", removeMember);

export default Workspace_memberRouter;
