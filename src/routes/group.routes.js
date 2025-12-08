import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { createGroup, getGroupsByUser, removeGroup, addMemberToGroup, getMembersInGroup } from "../controllers/group.controller.js";

const GroupRouter = Router();

GroupRouter.post("/create", authenticateJWT, createGroup);

GroupRouter.get("/user", authenticateJWT, getGroupsByUser);

GroupRouter.post("/add-member", authenticateJWT, addMemberToGroup);

GroupRouter.get("/:group_id/member", authenticateJWT, getMembersInGroup);


GroupRouter.delete("/:group_id", authenticateJWT, removeGroup);
export default GroupRouter;