import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createProject, getProjectsByOwner, assignProjectToGroup, assignProjectToUser, deleteProject, updateProject, getMyProjects } from "../controllers/project.controller.js";

const ProjectRouter = Router();
const upload = multer({ dest: "uploads/" });

ProjectRouter.post("/create", authenticateJWT, upload.single("file") ,createProject);

ProjectRouter.get("/owner", authenticateJWT, getProjectsByOwner);

ProjectRouter.post("/assign-group", authenticateJWT, assignProjectToGroup);

ProjectRouter.post("/assign-user", authenticateJWT, assignProjectToUser);

ProjectRouter.put("/:project_id/update", authenticateJWT, updateProject);

ProjectRouter.delete("/:project_id", authenticateJWT, deleteProject);

ProjectRouter.get("/my-projects", authenticateJWT, getMyProjects);
export default ProjectRouter;

