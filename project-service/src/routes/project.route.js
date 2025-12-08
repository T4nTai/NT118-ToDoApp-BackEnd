// src/routes/project.routes.js
import { Router } from "express";
import multer from "multer";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";

import {
  createProject,
  getProjectsByOwner,
  getMyProjects,
  assignProjectToGroup,
  assignProjectToUser,
  addMemberToProject,
  updateProject,
  deleteProject,
  getProjectMembers,
} from "../controllers/project.controller.js";

const ProjectRouter = Router();
const upload = multer({ dest: "uploads/" });


ProjectRouter.use(authenticateFromGateway);


ProjectRouter.post("/create", upload.single("file"), createProject);


ProjectRouter.get("/owner", getProjectsByOwner);


ProjectRouter.get("/my-projects", getMyProjects);


ProjectRouter.post("/assign-group", assignProjectToGroup);


ProjectRouter.post("/assign-user", assignProjectToUser);


ProjectRouter.post("/add-member", addMemberToProject);


ProjectRouter.put("/:project_id/update", updateProject);


ProjectRouter.delete("/:project_id", deleteProject);


ProjectRouter.get("/:project_id/members", getProjectMembers);

export default ProjectRouter;
