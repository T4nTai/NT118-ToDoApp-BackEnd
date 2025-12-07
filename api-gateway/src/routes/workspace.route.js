import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { workspaceProxy } from "../proxy/workspace.proxy.js";

const workspaceRoutes = Router();

workspaceRoutes.use("/workspace", authMiddleware, workspaceProxy);

export default workspaceRoutes;