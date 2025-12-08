// src/routes/internal/task.internal.route.js
import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import { TaskInternalController } from "../controllers/internal.controller.js";

const InternalRouter = Router();

InternalRouter.use(internalMiddleware);

InternalRouter.get("/:task_id", TaskInternalController.detail);
InternalRouter.get("/project/:project_id", TaskInternalController.byProject);
InternalRouter.get("/user/:user_id/assigned", TaskInternalController.assignedToUser);

export default InternalRouter;
