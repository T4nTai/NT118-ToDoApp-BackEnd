// src/routes/subtask.route.js
import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import { SubtaskController } from "../controllers/subtask.controller.js";

const SubtaskRouter = Router();

SubtaskRouter.use(authenticateFromGateway);

SubtaskRouter.post("/task/:task_id", SubtaskController.create);
SubtaskRouter.put("/:subtask_id", SubtaskController.update);
SubtaskRouter.delete("/:subtask_id", SubtaskController.delete);

export default SubtaskRouter;
