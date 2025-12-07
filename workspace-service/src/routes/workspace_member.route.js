import { Router } from "express";
import { MemberController } from "../controllers/workspace_member.controller.js";

const Workspace_memberRouter = Router();

Workspace_memberRouter.post("/add", MemberController.add);
Workspace_memberRouter.post("/remove", MemberController.remove);

export default Workspace_memberRouter;
