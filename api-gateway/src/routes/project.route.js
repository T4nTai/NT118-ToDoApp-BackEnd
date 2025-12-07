import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { projectProxy } from "../proxy/project.proxy.js";

const projectRoutes = Router();

projectRoutes.use("/project", authMiddleware, projectProxy);
projectRoutes.use("/milestone", authMiddleware, projectProxy);
projectRoutes.use("/workflow", authMiddleware, projectProxy);
projectRoutes.use("/performance", authMiddleware, projectProxy);

export default projectRoutes;