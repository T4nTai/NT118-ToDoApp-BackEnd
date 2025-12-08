import { Router } from "express";
import { internalMiddleware } from "../middleware/internal.middleware.js";
import { ProjectInternalController } from "../controllers/internal.controller.js";

const InternalRouter = Router();


InternalRouter.use(internalMiddleware);


InternalRouter.get("/:project_id/exists", ProjectInternalController.exists);


InternalRouter.get("/:project_id", ProjectInternalController.detail);


InternalRouter.get("/:project_id/members", ProjectInternalController.members);


InternalRouter.get("/user/:user_id/projects", ProjectInternalController.userProjects);

export default InternalRouter;
