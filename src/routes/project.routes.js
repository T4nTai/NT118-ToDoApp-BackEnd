import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { createProject, getProjectsByOwner, assignProjectToGroup, assignProjectToUser, deleteProject, updateProject } from "../controllers/project.controller.js";

const ProjectRouter = Router();

ProjectRouter.post("/create", authenticateJWT, createProject);

ProjectRouter.get("/owner", authenticateJWT, getProjectsByOwner);

ProjectRouter.post("/assign-group", authenticateJWT, assignProjectToGroup);

ProjectRouter.post("/assign-user", authenticateJWT, assignProjectToUser);

ProjectRouter.put("/:project_id/update", authenticateJWT, updateProject);

ProjectRouter.delete("/:project_id", authenticateJWT, deleteProject);
export default ProjectRouter;

