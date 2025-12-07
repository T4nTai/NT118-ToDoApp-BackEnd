import express from "express";
import { ProjectController } from "../controllers/project.controller.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/", ProjectController.create);
ProjectRouter.get("/:project_id", ProjectController.detail);
ProjectRouter.put("/:project_id", ProjectController.update);
ProjectRouter.delete("/:project_id", ProjectController.delete);

ProjectRouter.post("/:project_id/member", ProjectController.addMember);
ProjectRouter.delete("/:project_id/member/:user_id", ProjectController.removeMember);

ProjectRouter.post("/:project_id/assign/group", ProjectController.assignGroup);
ProjectRouter.post("/:project_id/assign/user", ProjectController.assignUser);

export default ProjectRouter;