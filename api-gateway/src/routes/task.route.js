import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { taskProxy } from "../proxy/task.proxy.js";

const taskRoutes = Router();

taskRoutes.use("/task", authMiddleware, taskProxy);

export default taskRoutes;
