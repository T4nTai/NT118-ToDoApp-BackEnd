import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import {
  createGroup,
  getGroupsByUser,
  removeGroup,
  addMemberToGroup,
} from "../controllers/group.controller.js";

const GroupRouter = Router();

GroupRouter.use(authenticateFromGateway);

GroupRouter.post("/create", createGroup);
GroupRouter.get("/user", getGroupsByUser);
GroupRouter.post("/add-member", addMemberToGroup);
GroupRouter.delete("/:group_id", removeGroup);

export default GroupRouter;
