import { Router } from "express";
import { internalMiddleware } from "../../middleware/internal.middleware.js";
import { ProjectInternalController } from "../../controllers/internal.controller.js";

const InternalRouter = Router();


InternalRouter.get("/:project_id/exists", internalMiddleware, ProjectInternalController.exists);


InternalRouter.get("/:project_id", internalMiddleware, ProjectInternalController.detail);


InternalRouter.get("/:project_id/members", internalMiddleware, ProjectInternalController.members);


InternalRouter.get("/:project_id/member/:user_id", internalMiddleware, ProjectInternalController.checkMember);


InternalRouter.get("/user/:user_id/projects", internalMiddleware, ProjectInternalController.userProjects);

export default InternalRouter;
