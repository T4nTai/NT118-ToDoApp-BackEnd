import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import {
  internalCheckGroupExists,
  internalGetGroupMembers,
  internalCheckGroupMember,
  internalGetUserGroups,
} from "../controllers/internal.controller.js";

const InternalRouter = Router();

InternalRouter.use(internalMiddleware);

InternalRouter.get("/:group_id/exists", internalCheckGroupExists);
InternalRouter.get("/:group_id/members", internalGetGroupMembers);
InternalRouter.get("/:group_id/member/:user_id", internalCheckGroupMember);
InternalRouter.get("/user/:user_id/groups", internalGetUserGroups);

export default InternalRouter;
